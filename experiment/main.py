import argparse
import asyncio
import json
import os
import platform
import signal
import time
import requests
import progressbar
import zipfile
import subprocess
import shutil
import datetime
import random
import psutil
import glob

# Download chromium if not already downloaded.
class ZipDownloader:
	def __init__(self, name, data_folder, zip_name, keep_zip=True, overwrite_zip=False, force_unzip=False):
		self.data_folder = data_folder
		self.name = name
		self.zip_name = zip_name
		self.keep_zip = keep_zip
		self.overwrite_zip = overwrite_zip
		self.force_unzip = force_unzip

	def check_if_zip_exists(self):
		return os.path.exists(os.path.join(DATA_FOLDER, self.zip_name))
	
	def download(self, url):
		if not self.overwrite_zip and self.check_if_zip_exists():
			print(f'{self.name} already exists. Skipping download')
			return

		response = requests.get(url, stream=True)
		download_path = os.path.join(DATA_FOLDER, self.zip_name)
		file = open(download_path, 'wb')
		total_length = int(response.headers.get('content-length'))
		total_length_mb = total_length / (1024 * 1024)

		print(f'Downloading {self.name} ({total_length_mb:.2f} MB)')

		widgets = [progressbar.Bar(), progressbar.Percentage(), " | ", progressbar.FileTransferSpeed(), " | ", progressbar.ETA()]
		bar = progressbar.ProgressBar(widgets=widgets, maxval=total_length).start()

		for chunk in response.iter_content(chunk_size=8192):
			file.write(chunk)
			bar.update(file.tell())

		file.close()
		bar.finish()

	def unzip(self, folder=None):
		if not self.force_unzip and os.path.exists(self.get_folder()):
			print(f'{self.name} already unzipped. Skipping unzip')
			return

		print(f'Unzipping {self.name}')
		zip_path = os.path.join(DATA_FOLDER, self.zip_name)
		to = os.path.join(DATA_FOLDER, folder) if folder else DATA_FOLDER
		with zipfile.ZipFile(zip_path, 'r') as zip_ref:
			zip_ref.extractall(to)

	def clean_zip(self):
		if self.keep_zip:
			return

		print(f'Cleaning up {self.name} zip file')
		zip_path = os.path.join(DATA_FOLDER, self.zip_name)
		os.remove(zip_path)

	def run(self):
		pass

class ChromiumDownloader(ZipDownloader):
	def __init__(self):
		super().__init__('Chromium', DATA_FOLDER, 'chromium.zip')

	def get_platform(self):
		platform_name = platform.system()

		if platform_name == 'Windows':
			if platform.architecture()[0] == '32bit':
				return 'Win'
			else:
				return 'Win_x64'
		elif platform_name == 'Darwin':
			if platform.machine() == 'arm64':
				return 'Mac_Arm'
			else:
				return 'Mac'
		elif platform_name == 'Linux':
			if platform.architecture()[0] == '32bit':
				return 'Linux'
			else:
				return 'Linux_x64'
		
		raise Exception('Platform not supported')
	
	def get_folder(self):
		platform_name = platform.system()

		if platform_name == 'Windows':
			return os.path.join(DATA_FOLDER, 'chrome-win')
		elif platform_name == 'Darwin':
			return os.path.join(DATA_FOLDER, 'chrome-mac')
		elif platform_name == 'Linux':
			return os.path.join(DATA_FOLDER, 'chrome-linux')
		
		raise Exception('Platform not supported')

	def run(self):
		super().run()

		platform = self.get_platform()	
		url = f'https://download-chromium.appspot.com/dl/{platform}?type=snapshots'
		self.download(url)
		self.unzip()
		self.clean_zip()
	
# Controls the Chromium instance and its respective configurations
class Chromium:
	def __init__(self):
		self.user_folder_name = 'chromium-user-data'
		self.remote_debugging_port = 9222

	@property
	def devtools_url(self):
		return f'http://localhost:{self.remote_debugging_port}/json'

	def get_user_folder(self):
		return os.path.abspath(os.path.join(DATA_FOLDER, self.user_folder_name))

	def create_user_folder(self, force=True):
		folder = self.get_user_folder()
		if os.path.exists(folder):
			if force:
				shutil.rmtree(folder)
			
			return

		os.makedirs(folder)

	def get_folder(self):
		platform_name = platform.system()

		if platform_name == 'Windows':
			return os.path.join(DATA_FOLDER, 'chrome-win')
		elif platform_name == 'Darwin':
			return os.path.join(DATA_FOLDER, 'chrome-mac')
		elif platform_name == 'Linux':
			return os.path.join(DATA_FOLDER, 'chrome-linux')
		
		raise Exception('Platform not supported')
	
	def get_executable(self):
		platform_name = platform.system()

		if platform_name == 'Windows':
			return os.path.join(self.get_folder(), 'chrome.exe')
		elif platform_name == 'Darwin':
			return os.path.join(self.get_folder(), 'Chromium.app', 'Contents', 'MacOS', 'Chromium')
		elif platform_name == 'Linux':
			return os.path.join(self.get_folder(), 'chrome')
		
		raise Exception('Platform not supported')
	
	def args(self, tab_url, extensions_folders=[], expect_extensions_loaded=False):
		extensions_folders = [folder for folder in extensions_folders if folder is not None]
		extension_folders_str = ','.join(extensions_folders) if extensions_folders is not None else ''
		arguments = [
			self.get_executable(), 
			'--disable-background-networking',
			'--disable-background-timer-throttling',
			f'--remote-debugging-port={self.remote_debugging_port}', 
			'--no-first-run', 
			'--disable-component-extensions-with-background-pages', 
			'--disable-default-apps',
			tab_url
		]
		if platform.system() == 'Windows':
			arguments.append(f'--user-data-dir={self.get_user_folder()}')
		if extensions_folders is None or len(extensions_folders) > 0:
			arguments.insert(1, f'--disable-extensions-except={extension_folders_str}')
			arguments.insert(1, f'--load-extension={extension_folders_str}')
		else:
			arguments.insert(1, '--disable-extensions')
		
		return arguments
	
	def dev_data(self):
		res = requests.get(self.devtools_url)

		if res.status_code != 200:
			raise Exception('Could not connect to Chromium')
		
		return res.json()
	
	def get_last_tab_id(self):
		data = self.dev_data()
		return data[0]['id']
	
	def close_tab(self, tab_id):
		requests.get(f'{self.devtools_url}/close/{tab_id}')

	def close_all_tabs(self):
		try:
			data = self.dev_data()
		except:
			return

		for tab in data:
			try:
				self.close_tab(tab['id'])
			except:
				return

class Step:
	def __init__(self, index: int, folder: str, chromium: Chromium, file_index: int, file: str):
		self.index = index
		self.chromium = chromium
		self.folder = folder
		self.file_index = file_index
		self.file = file

	async def run(self):
		start_time = time.time()
		output_file = os.path.join(self.folder, f'{self.index}_{self.file_index}_{os.path.basename(self.file)}.csv')
		args = [ENERGIBRIDGE, '-o', output_file, '--summary']
		args.extend(self.chromium.args('chrome://newtab'))
		print(f'> Starting Chromium through Energibridge -> {output_file}')
		proc = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

		# Give time for Chromium to open
		await asyncio.sleep(5)

		print(f'> Opening {self.file}')
		subprocess.run(self.chromium.args(self.file))
		# Give time for the tab to load
		await asyncio.sleep(10)
		
		last_tab_id = self.chromium.get_last_tab_id()
		self.chromium.close_tab(last_tab_id)
		# Give time for the tab to close
		await asyncio.sleep(1)

		# Close Chromium
		print('> Closing Chromium')
		proc.kill()
		await asyncio.sleep(1)

		self.chromium.close_all_tabs()
		await asyncio.sleep(5)
		end_time = time.time()
		print(f'=> Step took {end_time - start_time:.2f} seconds')

class StepSet:
	def __init__(self, index, n_sets, folder, files):
		self.index = index
		self.n_sets = n_sets
		self.folder = folder
		self.chromium = Chromium()
		self.steps = []
		self.files = files

		for i, file in enumerate(files):
				self.steps.append(Step(index, folder, self.chromium, i, file))
		
		random.seed(self.index)
		random.shuffle(self.steps)

		index_pairs = [f"{step.file_index}" for step in self.steps]
		print(f'Set {self.index + 1}/{n_sets} has {len(self.steps)} steps with ordering {", ".join(index_pairs)}')


	async def reset_user_data(self):
		print('> Resetting user data by deleting old folder')
		self.chromium.create_user_folder()

	async def run(self):
		start_time = time.time()
		# await self.reset_user_data()

		for i, step in enumerate(self.steps):
			print(f'Step {i + 1}/{len(self.steps)} (of total {self.n_sets * len(self.steps)}) -> file: {step.file}')
			
			await self.reset_user_data()
			await step.run()

			# Give time for the system to cool down
			await asyncio.sleep(1)

		end_time = time.time()
		print(f'=> Set {self.index + 1}/{self.n_sets} took {end_time - start_time:.2f} seconds')

class Experiment:
	def __init__(self, folder, files, n_sets, add_warmup=True, index=0):
		self.folder = folder
		self.files = files
		self.n_sets = n_sets
		self.add_warmup = add_warmup
		self.index = index

	async def run(self):
		chromium_dl = ChromiumDownloader()
		chromium_dl.run()

		if not os.path.exists(self.folder):
			os.makedirs(self.folder)

		time = datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
		folder = os.path.join(self.folder, time)

		if not os.path.exists(folder):
			os.makedirs(folder)

		if self.add_warmup:
			self.n_sets += 1

		for i in range(self.n_sets - self.index):
			i = self.index + i
			print(f'Set {i + 1}/{self.n_sets}')
			step_set = StepSet(i, self.n_sets, folder, self.files)
			await step_set.run()

args_def = argparse.ArgumentParser(description='Run our experiment with the Energibridge tool')
args_def.add_argument('--temp-dir', type=str, help='Temporary folder', default='data')
args_def.add_argument('-o', '--output', type=str, help='Output folder', default='output')
args_def.add_argument('-n', '--n-sets', type=int, help='Number of sets', default=1)
args_def.add_argument('--add-warmup', action='store_true', help='Round one round as warmup', default=True)
args_def.add_argument('-e', '--energibridge', type=str, help='Path to Energibridge executable', default=r"C:\Users\20202571\Downloads\energibridge-v0.0.7-x86_64-pc-windows-msvc\energibridge")
args_def.add_argument('--index', type=int, help='Index of the experiment', default=0)
args_def.add_argument('folder', help='folder with HTML files for testing (recursively looks for files)')
args = args_def.parse_args()

if __name__ == '__main__':
	DATA_FOLDER = args.temp_dir

	if not os.path.exists(DATA_FOLDER):
		os.makedirs(DATA_FOLDER)

	OUTPUT_FOLDER = args.output

	if not os.path.exists(OUTPUT_FOLDER):
		os.makedirs(OUTPUT_FOLDER)

	ENERGIBRIDGE = args.energibridge

	files = glob.glob(f'{args.folder}/**/*.html', recursive=True)
	asyncio.run(Experiment(OUTPUT_FOLDER, files, args.n_sets, args.add_warmup, args.index).run())
