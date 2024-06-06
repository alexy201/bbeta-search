const { OpenAI } = require("openai");

const search_custom_functions = [
    {
        type: "function",
        function: {
            name: 'extract_search_filters',
            description: 'Get Linkedin filter information from the search prompt',
            parameters: {
                type: 'object',
                properties: {
                    firstName: {
                        'type': 'string',
                        'description': 'First name of a person being looked up'
                    },
                    lastName: {
                        'type': 'string',
                        'description': 'Last name of a person being looked up'
                    },
                    title: {
                        type: 'string',
                        description: 'Job title that search results should have'
                    },
                    locations: {
                        "type": "array",
                        "items": {
                            "type": "string"
                        },
                        'description': 'Names of the locations that search results are based in'
                    },
                    currentCompany: {
                        'type': 'string',
                        'description': 'Name of the company that search results are currently working at'
                    },
                    pastCompany: {
                        "type": "array",
                        "items": {
                            "type": "string"
                        },
                        'description': 'Names of the company that search results have worked at in the past (NOT CURRENTLY)'
                    },
                    school: {
                        "type": "string",
                        'description': 'Name of the school that search results went to'
                    },
                    languages: {
                        "type": "array",
                        "items": {
                            "type": "string"
                        },
                        'description': 'Names of the languages that search results should know'
                    },
                    keywords: {
                        "type": "string",
                        'description': 'Extract other keywords from the prompt that are not names, titles/positions, locations, companies, or schools. Try not to extract whole phrases, but individual words'
                    }
                },
                required: ['keywords']
            }
        }
    }
]


export default async function buildFilter(message, api_key) {
    const openai = new OpenAI({
        apiKey: api_key,
        dangerouslyAllowBrowser: true
    });
    let messages = [
        { role: "system", content: "You are acting as a filter-generator for search results. Analyze the prompt carefully to determine the right parameters for the filter." },
        { role: "user", content: message },
    ]

    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
        tools: search_custom_functions,
        tool_choice: "required"
    });

    const completionResponse = completion.choices[0].message;
    const func_call = completionResponse.tool_calls[0].function
    const json_args = JSON.parse(func_call.arguments)

    console.log(json_args)

    return buildLinkedInSearchURL(json_args)
}



function buildLinkedInSearchURL(json_args) {
    const baseURL = "https://www.linkedin.com/search/results/people/";

    const params = new URLSearchParams();
    if ('currentCompany' in json_args) params.append("company", json_args['currentCompany']);
    if ('firstName' in json_args) params.append("firstName", json_args['firstName']);
    if ('lastName' in json_args) params.append("lastName", json_args['lastName']);
    if ('school' in json_args) params.append("schoolFreetext", `"${json_args['school']}"`);
    if ('title' in json_args) params.append("titleFreeText", json_args['title']);
    if ('keywords' in json_args) params.append("keywords", json_args['keywords']);

    console.log(`${baseURL}?${params.toString()}`)

    return `${baseURL}?${params.toString()}`;
}


/*


https://www.linkedin.com/search/results/people/?
company=Google&
firstName=Alex&
keywords=hello%20my%20name%20is&
lastName=Sima&origin=GLOBAL_SEARCH_HEADER&schoolFreetext=%22Yale%22&sid=o%2Cj&titleFreeText=Founder



*/