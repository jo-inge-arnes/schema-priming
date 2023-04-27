import axios from 'axios';

export class BackendHttp {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.headers = {
            'Content-Type': 'application/json'
        };
        this.httpBackend = axios.create({
            baseURL: this.baseUrl,
            headers: this.headers
        });
    }

    async schemaAndEmpty() {
        return this.httpBackend.get('/v1/schema-and-empty');
    }

    async validate(o) {
        return this.httpBackend.post('/v1/validate', o);
    }
}