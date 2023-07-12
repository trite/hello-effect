import { pipe } from '@effect/data/Function';
import * as Effect from '@effect/io/Effect';
import * as Exit from '@effect/io/Exit';

const divide = (a: number, b: number): Effect.Effect<never, Error, number> =>
  b === 0
    ? Effect.fail(new Error('Cannot divide by zero'))
    : Effect.succeed(a / b);

const log2 =
  (msg: string) =>
  (a: any): Effect.Effect<never, never, void> =>
    Effect.sync(() => console.log(msg, a));

const getRandom = (): Effect.Effect<never, never, number> =>
  Effect.sync(() => Math.random());

const pipeStyleProgram = pipe(
  getRandom(),
  Effect.tap(log2('Initial random value: ')),

  Effect.map((x) => Math.ceil(x * 10)),
  Effect.tap(log2('*10 and rounded up: ')),

  Effect.flatMap((x) => divide(10, x))
);

const doNotationProgram = Effect.gen(function* (_) {
  const random = yield* _(getRandom());
  yield* _(log2('Initial random value: ')(random));

  const x = yield* _(Effect.sync(() => Math.ceil(random * 10)));
  yield* _(log2('*10 and rounded up: ')(x));

  const result = yield* _(divide(10, x));
  return result;
});

function runLog<A>(effect: Effect.Effect<never, Error, A>): void {
  return pipe(
    effect,
    Effect.runSyncExit,
    Exit.match({
      onFailure: (err) => console.error(`Failed with ${err}`),
      onSuccess: (val) => console.log(`Success with ${val}`),
    })
  );
}

/* --- These are equivalent to one another, just different styles: --- */

// Pipe-style may be familiar to those with a pipe-style FP language background
// Also likely familiar to anyone used to Unix/Windows shell/bash/PS
runLog(pipeStyleProgram);

// Do-notation will be familiar to folks who come from a Haskell background
// It can also feel more familiar to anyone used to imperative languages
runLog(doNotationProgram);
