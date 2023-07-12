import { pipe } from '@effect/data/Function';
import * as Effect from '@effect/io/Effect';
import * as Exit from '@effect/io/Exit';
import * as Random from '@effect/io/Random';
import * as Cause from '@effect/io/Cause';

const divide = (a: number, b: number): Effect.Effect<never, Error, number> =>
  b === 0
    ? Effect.fail(new Error('Cannot divide by zero'))
    : Effect.succeed(a / b);

const log2 =
  (msg: string) =>
  (a: any): Effect.Effect<never, never, void> =>
    Effect.sync(() => console.log(msg, a));

// const getRandom = (): Effect.Effect<never, never, number> =>
//   Effect.sync(() => Math.random());

const pipeStyleProgram = pipe(
  Random.next,
  Effect.tap(log2('Initial random value: ')),

  Effect.map((x) => Math.floor(x * 10)),
  Effect.tap(log2('*10 and rounded down: ')),

  Effect.flatMap((x) => divide(10, x))
);

const doNotationProgram = Effect.gen(function* (_) {
  const random = yield* _(Random.next);
  yield* _(log2('Initial random value: ')(random));

  const x = yield* _(Effect.sync(() => Math.floor(random * 10)));
  yield* _(log2('*10 and rounded down: ')(x));

  return yield* _(divide(10, x));
});

function runLog<A>(effect: Effect.Effect<never, Error, A>): void {
  return pipe(
    effect,
    Effect.runSyncExit,
    Exit.match({
      onFailure: (err) => console.log(`Failed with ${Cause.pretty(err)}`),
      onSuccess: (val) =>
        console.log(`Succeeded dividing 10 by last result: ${val}`),
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
