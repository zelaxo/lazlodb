&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Logo](http://www.auplod.com/u/plaudob1d7a.png)

### Lazlo is a portable, compact & serverless NoSql database built using Node JS & MessagePack

## Storage
* Data is stored in **.laz** files in MessagePack encoded form. As MessagePack is smaller than JSON, it takes less space & hence the files are compact.
* Each **.laz** file represents a **document** (or a table in sql).
* All documents exist in a database, which is essentially a folder being tracked by lazlo.
