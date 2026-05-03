export const EXTRACTION_CONFIGS = {
	"ChatGPT": {
		"domainName": "ChatGPT",
		"pageTitle": {
			"selector": "h1, ol > li .bg-token-sidebar-surface-secondary a div"
		},
		"contentSelector": "main article",
		"extractionType": "message-list",
		"messageConfig": {
			"roleSelector": "[data-message-author-role]",
			"contentSelector": "article [data-message-author-role]",
			"roleAttribute": "data-message-author-role",
			"roles": {
				"assistant": "ChatGPT",
				"user": "User"
			}
		},
		"sourcesExtraction": {
			"selectors": [
				{
					"open": [{"selector": "p button span", "scope": "content"}],
					"close": [{"selector": "p button span", "scope": "content"}],
					"content": {"selector": "div.overflow-hidden a", "scope": "content"},
					"extractionType": "list"
				}
			]
		}
	},

	"ChatGPTShare": {
		"domainName": "ChatGPT",
		"pageTitle": {
			"selector": "h1"
		},
		"contentSelector": "main article",
		"extractionType": "message-list",
		"messageConfig": {
			"roleSelector": "[data-message-author-role]",
			"contentSelector": "article [data-message-author-role]",
			"roleAttribute": "data-message-author-role",
			"roles": {
				"assistant": "ChatGPT",
				"user": "User"
			}
		}
	},

	"ChatGPTBots": {
		"domainName": "ChatGPT",
		"pageTitle": {
			"selector": "h1"
		},
		"contentSelector": "main article",
		"extractionType": "message-list",
		"messageConfig": {
			"roleSelector": "[data-message-author-role]",
			"contentSelector": "article [data-message-author-role]",
			"roleAttribute": "data-message-author-role",
			"roles": {
				"assistant": "ChatGPT",
				"user": "User"
			}
		}
	},

	"ChatGPTSignedOut": {
		"domainName": "ChatGPT",
		"pageTitle": {
			"selector": "h1"
		},
		"contentSelector": "main article",
		"extractionType": "message-list",
		"messageConfig": {
			"roleSelector": "[data-message-author-role]",
			"contentSelector": "article [data-message-author-role]",
			"roleAttribute": "data-message-author-role",
			"roles": {
				"assistant": "ChatGPT",
				"user": "User"
			}
		}
	},

	"ClaudeChat": {
		"domainName": "Claude Chat",
		"pageTitle": {
			"selector": "[data-testid=\"chat-title-button\"], .tracking-tight.truncate"
		},
		"contentSelector": "[data-test-render-count]",
		"extractionType": "message-list",
		"messageConfig": {
			"userSelector": "[data-testid=\"user-message\"]",
			"assistantSelector": "[data-is-streaming] > div",
			"contentSelector": "[data-testid=\"user-message\"], [data-is-streaming] > div",
			"streamingIndicator": "[data-is-streaming]",
			"inputsSelector": "[data-testid=\"file-thumbnail\"]",
			"roles": {
				"user": "User",
				"assistant": "Claude"
			}
		},
		"actions": {
			"afterExtraction": {
				"type": "click_act_close"
			}
		}
	},

	"ClaudeIncognito": {
		"domainName": "Claude Chat (Incognito)",
		"pageTitle": {
			"selector": "[data-testid=\"chat-title-button\"], .tracking-tight.truncate"
		},
		"contentSelector": "[data-test-render-count]",
		"extractionType": "message-list",
		"messageConfig": {
			"userSelector": "[data-testid=\"user-message\"]",
			"assistantSelector": "[data-is-streaming] > div",
			"contentSelector": "[data-testid=\"user-message\"], [data-is-streaming] > div",
			"streamingIndicator": "[data-is-streaming]",
			"inputsSelector": "[data-testid=\"file-thumbnail\"]",
			"roles": {
				"user": "User",
				"assistant": "Claude"
			}
		},
		"actions": {
			"afterExtraction": {
				"type": "click_act_close"
			}
		}
	},

	"ClaudeShare": {
		"domainName": "Claude Chat",
		"pageTitle": {
			"selector": ".tracking-tight.truncate"
		},
		"contentSelector": "[data-test-render-count]",
		"extractionType": "message-list",
		"messageConfig": {
			"userSelector": "[data-testid=\"user-message\"]",
			"assistantSelector": "[data-is-streaming] > div",
			"contentSelector": "[data-testid=\"user-message\"], [data-is-streaming] > div",
			"streamingIndicator": "[data-is-streaming]",
			"roles": {
				"user": "User",
				"assistant": "Claude"
			}
		}
	},

	"Perplexity": {
		"domainName": "Perplexity",
		"pageTitle": {
			"selector": "h1"
		},
		"contentSelector": '[class*="pb-[var(--thread-visual-spacing)]"] > div > .max-w-threadContentWidth, main .scrollable-container > div > div > div > div > div > div:not([class])',
		"extractionType": "search-sections",
		"sectionConfig": {
			"userQuestionSelector": ".break-words",
			"aiAnswerSelector": ".relative.default > div > div"
		},
		"sourcesExtraction": {
			"selectors": [
				{
					"open": [{
						"selector": "button svg.tabler-icon-dots",
						"scope": "content",
						"wait": 50
					}, {
						"selector": ".md\\:h-full.group\\/item",
						"scope": "document",
						"wait": 50
					}],
					"close": [{"selector": "[data-testid=\"close-modal\"], div.w-full.relative button[aria-label].h-8:not([aria-label=\"Submit\"])", "scope": "document", "wait": 50}],
					"selector": ".relative > div > .flex-col.flex > div.items-start",
					"extractionType": "list",
					"scope": "content"
				},
				{
					"open": [{"selector": "div.grid > div.flex:nth-last-of-type(1)", "scope": "content", "wait": 50}],
					"close": [{"selector": "[data-testid=\"close-modal\"]", "scope": "document", "wait": 50}],
					"selector": ".fixed > div > [class] > div > div > div > div > div > .group",
					"extractionType": "list"
				},
				{
					"selector": "div.grid > div.flex",
					"extractionType": "tile-list"
				}
			]
		}
	},

	"PerplexityPages": {
		"domainName": "Perplexity Pages",
		"pageTitle": {
			"selector": "main .mx-auto > div > div > div > div > div.flex-col .break-words"
		},
		"contentSelector": "main .mx-auto > div > div > div > div > div.flex-col[data-last-section], main .mx-auto > div > div > div > div > div.flex-col:first-of-type",
		"extractionType": "articles-sections",
		"sourcesExtraction": {
			"selectors": [
				{
					"open": [{"selector": "div.grid > div.flex:nth-last-of-type(1), .group\\/source", "scope": "content", "wait": 50}],
					"close": [{"selector": "[data-testid=\"close-modal\"]", "scope": "document", "wait": 50}],
					"selector": ".fixed > div > [class] > div > div > div > div > div > .group",
					"extractionType": "list"
				},
				{
					"selector": "div.grid > div.flex",
					"extractionType": "tile-list"
				}
			],
			"afterAction": "[data-testid=\"close-modal\"]"
		}
	},

	"PhindSearch": {
		"domainName": "Phind Search",
		"pageTitle": {
			"selector": "h2"
		},
		"contentSelector": ".chat-qa-pair",
		"extractionType": "search-sections",
		"sectionConfig": {
			"userQuestionSelector": ".chat-question",
			"aiModelSelector": ".model-pill",
			"aiAnswerSelector": ".chat-answer"
		},
		"actions": {
			"beforeExtraction": {
				"type": "click",
				"selector": ".sources-toggle-pill"
			},
			"afterExtraction": {
				"type": "click",
				"selector": ".minimize-button"
			}
		},
		"sourcesExtraction": {
			"selectors": [
				{
					"selector": ".chat-source-link",
					"extractionType": "list"
				}
			]
		}
	}
}