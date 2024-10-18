# Frontend

## Testing

### Unit tests

We are using [Vitest](https://vitest.dev/guide/why.html) to do unit testing of
the project. It is close to Jest library but take benefit from the Vite
ecosystem.

You can start unit testing by running `npm run test` and check test coverage via
`npm run coverage`

```json
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
```

```js
consttoto=(a)=>{
  return 123 + a
}
```
