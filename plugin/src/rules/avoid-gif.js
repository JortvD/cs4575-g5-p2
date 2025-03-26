module.exports = {
	meta: {
		type: "suggestion",
		docs: {
			description: "Avoid using GIF files",
			category: "Best Practices",
			recommended: false,
		},
		schema: [], // no options
	},
	create(context) {
		return {
			Literal(node) {
				if (typeof node.value === "string" && node.value.toLowerCase().endsWith(".gif")) {
					context.report({
						node,
						message: "Avoid using GIF files. Consider using modern formats like WebP or MP4.",
					});
				}
			},
			TemplateLiteral(node) {
				const text = node.quasis.map((quasi) => quasi.value.cooked).join("").toLowerCase();
				if (text.endsWith(".gif")) {
					context.report({
						node,
						message: "Avoid using GIF files. Consider using modern formats like WebP or MP4.",
					});
				}
			},
		};
	},
};