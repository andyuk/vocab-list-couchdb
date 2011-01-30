#  Vocab-app

A simple app for learning vocab. 

# First version

- CouchDB on cloudant only.
- No authentication, by URL only.

# TODO

- Cookie based login in NodeJS
  - Authenticates based on logins in couchdb
- CouchDB behind simple NodeJS proxy

# couchdb local.ini configuration

[vhosts]
vocab.andyuk.local:5984 = /vocab-db/_design/vocab-app/_rewrite
