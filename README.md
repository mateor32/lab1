### Lab22026

[![CI/CD Pipeline](https://github.com/mateor32/lab1/actions/workflows/build.yml/badge.svg)](https://github.com/mateor32/lab1/actions/workflows/build.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=mateor32_lab1&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=mateor32_lab1)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=mateor32_lab1&metric=bugs)](https://sonarcloud.io/summary/new_code?id=mateor32_lab1)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=mateor32_lab1&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=mateor32_lab1)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=mateor32_lab1&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=mateor32_lab1)

Implementation of a Simple App with the next operations:

- Get random nations
- Get random currencies
- Get random Aircraft
- Get application version
- health check
  Including integration with GitHub Actions, Sonarqube (SonarCloud), Coveralls and
  Snyk

### Folders Structure

In the folder `src` is located the main code of the app
In the folder `test` is located the unit tests

### How to install it

Execute:

```shell

$ mvnw spring-boot:run
```

to download the node dependencies

### How to test it

Execute:

```shell
$ mvnw clean install
```

### How to get coverage test

Execute:

```shell
$ mvwn -B package -DskipTests --file pom.xml
```
