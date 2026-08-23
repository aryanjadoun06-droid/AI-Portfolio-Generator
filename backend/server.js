const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

console.log("API key loaded:", !!process.env.GEMINI_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.get("/", (req, res) => {
    res.send("AI Portfolio Generator Backend is running!");
});

app.post("/generate", async (req, res) => {

    try {

        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                error: "Text is required"
            });
        }

        const prompt = `
You are an expert AI portfolio generator.

The user will give you unstructured information about themselves.

Your job is to extract the information and create professional
portfolio content.

IMPORTANT RULES:
1. Do not invent information.
2. If information is missing, return an empty string or empty array.
3. Improve grammar and make the content professional.
4. Keep the information truthful to the user's input.

USER INFORMATION:
${text}
`;

        console.log("Sending request to Gemini...");

        const response = await ai.models.generateContent({

            model: "gemini-3.6-flash",

            contents: prompt,

            config: {
                responseMimeType: "application/json",

                responseSchema: {
                    type: "object",

                    properties: {

                        name: {
                            type: "string"
                        },

                        headline: {
                            type: "string"
                        },

                        about: {
                            type: "string"
                        },

                        skills: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        },

                        projects: {
                            type: "array",
                            items: {
                                type: "object",

                                properties: {
                                    title: {
                                        type: "string"
                                    },

                                    description: {
                                        type: "string"
                                    },

                                    technologies: {
                                        type: "array",
                                        items: {
                                            type: "string"
                                        }
                                    }
                                },

                                required: [
                                    "title",
                                    "description",
                                    "technologies"
                                ]
                            }
                        },

                        education: {
                            type: "array",
                            items: {
                                type: "object",

                                properties: {
                                    degree: {
                                        type: "string"
                                    },

                                    institution: {
                                        type: "string"
                                    },

                                    year: {
                                        type: "string"
                                    }
                                },

                                required: [
                                    "degree",
                                    "institution",
                                    "year"
                                ]
                            }
                        },

                        experience: {
                            type: "array",
                            items: {
                                type: "object",

                                properties: {
                                    role: {
                                        type: "string"
                                    },

                                    company: {
                                        type: "string"
                                    },

                                    description: {
                                        type: "string"
                                    }
                                },

                                required: [
                                    "role",
                                    "company",
                                    "description"
                                ]
                            }
                        },

                        achievements: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        },

                        contact: {
                            type: "object",

                            properties: {
                                email: {
                                    type: "string"
                                },

                                github: {
                                    type: "string"
                                },

                                linkedin: {
                                    type: "string"
                                }
                            },

                            required: [
                                "email",
                                "github",
                                "linkedin"
                            ]
                        }
                    },

                    required: [
                        "name",
                        "headline",
                        "about",
                        "skills",
                        "projects",
                        "education",
                        "experience",
                        "achievements",
                        "contact"
                    ]
                }
            }
        });

        // Convert Gemini JSON text into JavaScript object
        const portfolio = JSON.parse(response.text);

        console.log("Portfolio generated successfully!");

        res.json({
            success: true,
            portfolio: portfolio
        });

    } catch (error) {

        console.error("GEMINI ERROR:");
        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});