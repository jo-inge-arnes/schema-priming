# Prototype for priming LLMs with schemas

Prototype demonstrating the approach presented in the paper *Schema-Based Priming of Large Language Model for Data Object Validation
Compliance*, which is currently [available as a preprint](https://).

Note that the system message prompt has been altered to perform better on GPT-3.5 Turbo compared to message listed the preprint. This is one of the changes that will be made to the final version of the paper.

To run, start the backend and the client servers.

## Backend
The backend is written in Python using Flask, and is located under *[backend](backend/)*. To start the server:

1. `cd backend`
2. Activate the venv-environment with `. .venv/bin/activate`
3. Run the server with `flask --app app run`

## Client
The client application is written in VUE 3, and is located under
*[client app](client-app/)*. Please read the *[README](client-app/README.md)*
for instructions.


