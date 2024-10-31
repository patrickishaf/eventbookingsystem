# Getting Started

Clone the project from github using:
```
git clone <repository_url>
```

# Installing Dependencies
You can either install dependencies manually or leverage the install shell script

## Installing dependencies with the shell script (Recommended)

1. Change into the project directory

```
cd ebs
```

2. Grant execution rights to the run.sh script

```
chmod u+x install.sh
```

3. Run the script to install all dependences in all services

```
./install.sh
```

## Installing dependencies manually

You will find that the project directory contains four child directories - booking,event, gateway and waitinglist.
Change into each of these directories and install dependencies

```
cd ebs/booking && npm i && cd ../event && npm i && cd ../gateway && npm i && cd ../waitinglist && npm i
```

# Launching the services

Each of the child directories is a standalone service. You have to launch the gateway service last. To launch each service, change into the directory and run the command

```
npm run dev
```

# Design and Architecture
The event-booking system in this repository is built with a message-driven microservices architecture. It is comprised of four different modules:
1. booking module
2. event module
3. gateway module
4. waitinglist module

# Architecture specification
1. All modules are standalone services that are highly decoupled from each other
2. All services are independently deployable
3. Services communicate with each other using message queuing and Remote Procedure Calls (RPCs). *RabbitMQ* is the message broker of choice in this system.
4. Each service maintains its own database
5. The services are all hidden from clients except the gateway service
6. The gateway service is an API gateway. It exposes a REST API to the client and functions as a proxy that routes the client's request to the appropriate service for processing

# Design Rationale
The system was designed with microservices architecture to achieve separation of concerns and make the system easily scalable. The reasons for using this architectural pattern are: 
1. Each service can be monitored separately and based on the amount of traffic it receives, it can be scaled up or down independently.
2. There will be a limited blast radius in the case of a failure. This means that a failure in one part of the application will not bring down the entire system
3. Each of the services will be easier to reason about in the context of the entire application
4. RPCs Provide faster communication between these services
5. Messqge queuing provides better isolation between the services and promotes loose coupling between them
6. Using separate databases for each service allows for better information hiding. This means that a service will not have unrestricted access to the data in another service. It can only read data that is provided to it. It is a good way to tackle system vulnerability.


# API Documentation

You can find the API documentation with [this link](https://documenter.getpostman.com/view/27707407/2sAY4vgi55)