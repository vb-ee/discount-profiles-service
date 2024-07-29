# Discounting Platform Profile Service

This is the Profile microservice for the Discounting Platform project. This service handles CRUD operations on user profiles.

## Launching

### Build an image

Dev:

`docker build -t profile-service -f Dockerfile.dev`

Prod:

`docker build -t profile-service Dockerfile`

### Run the container

`docker run -d -p 8080:80 profile-service`

If you want to run the entire project, please go to the [parent repository](https://github.com/vb-ee/discount-platform).
