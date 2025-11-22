## how to do things

- `bun` -- used as only a package manager.
- `bun run test --run` -- run the tests with `vitest`. Make sure you use the `--run` flag so that it
  doesn't run in watch mode, which will make it hard for you to view the output.
- `bun lint` -- lint the project with a simple eslint configuration
- `bun run dev` -- start the development server on http://localhost:3000.

## architecture

- architecture is deliberately simple. prefer flat file structures and low dependencies.
- most logic can be implemented using nothing but Hono and server-side JSX. where client-side
  interactivity is desired, we use `htmx`.
- we are not using React or any other similar client-side framework. don't get confused by the JSX
  -- it's just a convenience method for templating on the server. it doesn't do anything on the
  client. use HTMX for client-side interactivity when you need it.
- code should always be simple, terse, and straightforward. fail-fast when possible. avoid nesting
  and try/catch statements as much as possible. Prefer functions that do one thing over functions
  that do many things.

## agent guidelines

- do not over-comment code. top-level doc-comments are ok for publically exported functions, but
  avoid inline comments within functions explaining what each statement does.
- be technical and straight-forward in your communcation. avoid complimenting the user and any
  statement like "great question!" or "you're absolutely right!". skip the flattery and get straight
  to the point.
- prefer asking questions over making assumptions.
