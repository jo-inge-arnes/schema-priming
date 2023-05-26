# Priming LLMs with schemas for building valid data objects

Proof-of-concept demonstrating the approach presented in the paper *Schema-Based Priming of Large Language Model for Data Object Validation
Compliance*, currently available as a [preprint](https://dx.doi.org/10.2139/ssrn.4453361).

Note that the system message prompt has been altered to perform better on GPT-3.5 Turbo compared to message listed the preprint. This is one of the changes that will be made to the final version of the paper.

## Running the project
Follow the instructions below, and make sure to start both the backend and the client server.

## Backend
The backend is written in Python using Flask, and is located under *[backend](backend/)*. To start the server:

1. `cd backend`
2. Activate the venv-environment with `. .venv/bin/activate`
3. Run the server with `flask --app app run`

## Client
The client application is written in VUE 3, and is located under
*[client app](client-app/)*. Please read the *[README](client-app/README.md)*
for instructions.
