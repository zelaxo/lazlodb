&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Logo](http://www.auplod.com/u/plaudob1d7a.png)

### Lazlo is a portable, compact & serverless NoSql database built using Node JS & MessagePack

## Storage
* Data is stored in **.laz** files in MessagePack encoded form. As MessagePack is smaller than JSON, it takes less space & hence the files are compact.
* Each **.laz** file represents a **document** (or a table in sql).
* All documents exist in a database, which is essentially a folder being tracked by lazlo.

## Features
* Databases do not require an isolated environment. They can exist anywhere, even in your cloud folder (this will sync your database to the cloud).
* Very easy to use.
* Multiple commands for the same operation (Eg. **newdoc** & **create doc** both will create a new document).
* Interactive cli
* Extensive use of terminal styling (Eg. Success messages are displayed in green & errors are displayed in red)
* Command auto-completion available (Eg. Type create & press tab. You will get recommendations for all commands starting with create).
* Powerful inbuilt logger which logs all the transactions.
* Special features (Eg. Display all records in a document for a given creation date).

## How can I contribute?
#### I am a CS student & this project is being developed as a part of my final year project. There is a lot of work left, but these are some of the milestones I've set :
* Create a node js library for lazlo.
* Run lazlo on a server (currently only works as a local database)
* Implement buckets (You will probably see this word in the code. A bucket will act like a unique folder in the database which will hold the media files connected to a record).

## Major third party libraries used :
* vorpal js
* msgpack-lite
* chalk
* simple-node-logger
* edit-json-file

#### As I am a node js learner myself, all help & contribution is very well appreciated. If you find this idea or the underlying code useful, feel free to reuse it in your own projects.

#### Refer the wiki for usage docs (Warning : Under Development)
