# Green Shift Left - Evaluating energy efficiency on the web with static analysis

This is an experiment repository for 'Green Shift Left', a study on evaluating energy efficiency on the web with static analysis.

It makes use of [EnergiBridge](https://github.com/tdurieux/EnergiBridge) to measure the energy consumption of Chromium.

## Project Structure
The repository is structured as follows:
- `/experiment`: contains the scripts needed used to automatically run the experiments
- `/plugin_eslint`: contains the implementation for our energy-aware eslint plugin 
- `/results`: contains the results of the study
- `/rules`: contains the html pages that were used to measure the energy consumption of the anti-patterns and their optimised counterparts.

## Usage

This experiment can be run both on Windows and on Linux. 
Note: that the `main.py` script will have to be executed twice, the first time it will to automatically install `chromium` into the `data` directory (and then fail). All other subsequent runs it will automatically detect this instalation and function normally.

### Windows
1. Navigate into the `experiment` directory.

2. Run `python main.py -e $ENERGIBRIDGEPATH ../rules` where `-e $ENERGIBRIDGEPATH` is the relative path to the energibridge executable, and `../rules` specified the directory with the html inputs.The outputs by default are stored in the `output` directory.  

### Linux

Running on Linux requires a bit of extra setup.

1. Make sure to give the necessary permissions to EnergiBridge:
```bash
sudo chgrp -R msr /dev/cpu/*/msr;
sudo chmod g+r /dev/cpu/*/msr;
sudo setcap cap_sys_rawio=ep target/release/energibridge;
```
It also might be necessary to add the current user to the `msr` group.

2. Navigate into the `experiment` directory.

3. Run `python main.py -e $ENERGIBRIDGEPATH ../rules` where `-e $ENERGIBRIDGEPATH` is the relative path to the energibridge executable, and `../rules` specified the directory with the html inputs.The outputs by default are stored in the `output` directory.  