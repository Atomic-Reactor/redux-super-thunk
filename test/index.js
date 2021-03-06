import chai from 'chai';
import thunkMiddleware from '../src/index';
import * as tt from 'typescript-definition-tester';


describe('thunk middleware', () => {
  const doDispatch = () => {};
  const doGetState = () => {};
  const nextHandler = thunkMiddleware({dispatch: doDispatch, getState: doGetState});

  it('must return a function to handle next', () => {
    chai.assert.isFunction(nextHandler);
    chai.assert.strictEqual(nextHandler.length, 1);
  });

  describe('handle next', () => {
    it('must return a function to handle action', () => {
      const actionHandler = nextHandler();

      chai.assert.isFunction(actionHandler);
      chai.assert.strictEqual(actionHandler.length, 1);
    });

    describe('handle action', () => {
      it('must run the given action function with dispatch and getState', done => {
        const actionHandler = nextHandler();

        actionHandler((dispatch, getState) => {
          chai.assert.strictEqual(dispatch, doDispatch);
          chai.assert.strictEqual(getState, doGetState);
          done();
        });
      });

      it('must pass action to next if not a function', done => {
        const actionObj = {};

        const actionHandler = nextHandler(action => {
          chai.assert.strictEqual(action, actionObj);
          done();
        });

        actionHandler(actionObj);
      });

      it('must return the return value of next if not a function', () => {
        const expected = 'redux';
        const actionHandler = nextHandler(() => expected);

        const outcome = actionHandler();
        chai.assert.strictEqual(outcome, expected);
      });

      it('must return value as expected if a function', () => {
        const expected = 'rocks';
        const actionHandler = nextHandler();

        const outcome = actionHandler(() => expected);
        chai.assert.strictEqual(outcome, expected);
      });

      it('must be invoked synchronously if a function', () => {
        const actionHandler = nextHandler();
        let mutated = 0;

        actionHandler(() => mutated++);
        chai.assert.strictEqual(mutated, 1);
      });
    });
  });

  describe('no withExtraArgument', () => {
    it('must pass store to the third argument', done => {
      thunkMiddleware({
        dispatch: doDispatch,
        getState: doGetState,
      })()((dispatch, getState, store) => {
        chai.assert.strictEqual(dispatch, doDispatch);
        chai.assert.strictEqual(getState, doGetState);
        chai.assert.strictEqual(store.dispatch, doDispatch);
        chai.assert.strictEqual(store.getState, doGetState);
        done();
      });
    });
  });

  describe('withExtraArgument', () => {
    it('must pass the third argument and store as the fourth', done => {
      const extraArg = { lol: true };
      thunkMiddleware.withExtraArgument(extraArg)({
        dispatch: doDispatch,
        getState: doGetState,
      })()((dispatch, getState, arg, store) => {
        chai.assert.strictEqual(dispatch, doDispatch);
        chai.assert.strictEqual(getState, doGetState);
        chai.assert.strictEqual(store.dispatch, doDispatch);
        chai.assert.strictEqual(store.getState, doGetState);
        chai.assert.strictEqual(arg, extraArg);
        done();
      });
    });
  });

  describe('TypeScript definitions', function test() {
    this.timeout(0);

    it('should compile against index.d.ts', (done) => {
      tt.compileDirectory(
        __dirname,
        fileName => fileName.match(/\.ts$/),
        () => done()
      );
    });
  });
});
