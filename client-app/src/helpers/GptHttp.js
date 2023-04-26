import axios from 'axios';

export class GptHttp {
    constructor(apiKey, orgId, version, temp, top_p) {
        this.apiKey = apiKey;
        this.orgId = orgId;
        this.version = version;
        this.temp = temp;
        this.top_p = top_p;
        this.baseUrl = 'https://api.openai.com/v1/chat';
        this.headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          'OpenAI-Organization': this.orgId,
        };
        this.httpChat = axios.create({
            baseURL: this.baseUrl,
            headers: this.headers
          });
    }

    post(chatLines) {
        return this.httpChat.post('/completions', {
            model: this.version,
            messages: chatLines,
            temperature: this.temp,
            top_p: this.top_p
          });
    }
}