## Available Scripts

In the project directory, you can run:

### `npm run build`

Builds the server (compiles it) and outputs the files to the "dist" directory.

### `npm run start`

Runs the server using the compiled files from "npm run build".

### `npm run dev`

Runs the server using the compiled files from "npm run build".
Launches the server in the interactive watch mode.


## Other Commands

### Postgres Setup Command
psql --username USERNAME -f setup.sql

If the DB server says that it can't find is bad and it asks if postgres is even running on the socket, then go to (on Mac):
Setttings -> Login Items -> Allow in the Background, then turn on "EnterpriseDB Corporation"