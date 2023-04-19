
# InnovandoLiving MercadoPago - (e-Commerce Backend)

This microservice functions as a payment gateway, using MercadoPago. All transactions processed through it will be registered in the system's database.


## Getting Started 🚀

No matter where you deploy this project, you must be able to set the environment variables required by this microservice. Please refer to the installation instructions to ensure that this service can be brought online.


### Pre-requisites 📋

NodeJS must be installed in order to use this service. It can be installed on Heroku, Docker, AWS or any other system that allows for setting environment variables.

### How to Install 🔧

After deploying to your selected system, you will need to define the values for the following environment variables:
MONGODB_CNN="url of your mongodb database"

ACCESS_TOKEN="Token from MercadoPago required for its connectivity"

SECRETJWTKEY="Secret Json Web Token key"

Below you will find some examples of the required format:
MONGODB_CNN=mongodb+srv://username:password@cluster0.m8scl.mongodb.net/collectionName
ACCESS_TOKEN=APP_USR-7283909654097762-020111-081a472d19b4d1fa123df44404e1a753-1057422018
SECRETJWTKEY=0ds24094-9873-22f3-7efe-e912d8f5fe20

## Deploy 📦

You can deploy on heroku, aws or any other system/cloud you like.


## Built with 🛠️

* [MercadoPago](https://www.npmjs.com/package/mercadopago) - This library provides developers with a simple set of bindings to help you integrate Mercado Pago API to a website and start receiving payments..
* [Jwt-Decode](https://www.npmjs.com/package/jwt-decode) - small browser library that helps decoding JWTs token which are Base64Url encoded.
* [dotenv](https://www.npmjs.com/package/dotenv) - Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.


## Version 📌

We used [SemVer](http://semver.org/) for versioning. Check out the whole version list available [tagsRepo](https://github.com/dguglielmi-git/innovandoliving-mercadopago/tags).


## Author ✒️

* **Daniel Guglielmi** - *Software Engineer* - [dguglielmi-git](https://github.com/dguglielmi-git)


## License 📄

No license required.

## Thanks 🎁

* Thank you for utilizing my project, I sincerely appreciate your interest and hope it meets your needs. 😇 

---
⌨️ with ❤️ by [dguglielmi-git](https://github.com/dguglielmi-git) 😊
