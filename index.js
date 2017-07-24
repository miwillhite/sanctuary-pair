/*             ___________________
              /                  /\
             /                  /  \
            /_____       ______/   /
            \    /      /\     \  /
             \__/      /  \_____\/
               /      /   /
              /      /   /
             /      /   /
            /      /   /
           /      /   /
          /______/   /
          \      \  /
           \______\/                */

//. # sanctuary-pair
//.
//. <img alt="Fantasy Land" src="https://raw.githubusercontent.com/fantasyland/fantasy-land/master/logo.png" width="200" height="200" align="right">
//.
//. Pair (2-tuple) is the canonical product type: a value of type `Pair a b`
//. always contains exactly two values, one of type `a`, the other `b`.
//.
//. `Pair a b` satisfies the following [Fantasy Land][] specifications:
//.
//.   - [Setoid][] (if `a` and `b` satisfy Setoid)
//.   - [Ord][] (if `a` and `b` satisfy Ord)
//.   - [Semigroupoid][]
//.   - [Semigroup][] (if `a` and `b` satisfy Semigroup)
//.   - [Functor][]
//.   - [Bifunctor][]
//.   - [Apply][] (if `a` satisfies Semigroup)
//.   - [Chain][] (if `a` satisfies Semigroup)
//.   - [Foldable][]
//.   - [Traversable][]
//.   - [Extend][]
//.   - [Extract][]

(function(f) {

  'use strict';

  /* istanbul ignore else */
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = f(require('sanctuary-type-classes'));
  } else if (typeof define === 'function' && define.amd != null) {
    define(['sanctuary-type-classes'], f);
  } else {
    self.sanctuaryPair = f(self.sanctuaryTypeClasses);
  }

}(function(Z) {

  'use strict';

  //# Pair :: (a, b) -> Pair a b
  //.
  //. TK.
  //.
  //. ```javascript
  //. > Pair(1, 2)
  //. Pair(1, 2)
  //. ```
  function Pair(fst, snd) {
    if (!(this instanceof Pair)) return new Pair(fst, snd);
    this.fst = fst;
    this.snd = snd;
  }

  /* global Symbol */
  // istanbul ignore next: browser support
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    //# Pair#[Symbol.iterator] :: Pair a b ~> () -> Iterator a b
    //.
    //. TK.
    //.
    //. ```javascript
    //. > [...Pair(1, 2)]
    //. [1, 2]
    //. ```
    Pair.prototype[Symbol.iterator] = function values() {
      return [this.fst, this.snd][Symbol.iterator]();
    };
  }

  //# Pair.@@type :: String
  //.
  //. Pair [type identifier][].
  //.
  //. ```javascript
  //. > Pair['@@type']
  //. 'sanctuary-pair/Pair@1'
  //. ```
  Pair['@@type'] = 'sanctuary-pair/Pair@1';

  //# Pair#fantasy-land/equals :: (Setoid a, Setoid b) => Pair a b ~> Pair a b -> Boolean
  //.
  //. TK.
  //.
  //. ```javascript
  //. > Z.equals(Pair([1, 2, 3], [3, 2, 1]), Pair([1, 2, 3], [3, 2, 1]))
  //. true
  //.
  //. > Z.equals(Pair([1, 2, 3], [3, 2, 1]), Pair([1, 2, 3], [1, 2, 3]))
  //. false
  //. ```
  Pair.prototype['fantasy-land/equals'] = function equals(other) {
    return Z.equals(this.fst, other.fst) && Z.equals(this.snd, other.snd);
  };

  //# Pair#fantasy-land/lte :: (Ord a, Ord b) => Pair a b ~> Pair a b -> Boolean
  //.
  //. TK.
  //.
  //. ```javascript
  //. > Z.lte(Pair(0, 1), Pair(0, 1))
  //. true
  //.
  //. > Z.lte(Pair(0, 1), Pair(1, 1))
  //. true
  //.
  //. > Z.lte(Pair(1, 1), Pair(0, 1))
  //. false
  //. ```
  Pair.prototype['fantasy-land/lte'] = function lte(other) {
    return Z.lte(this.fst, other.fst) && Z.lte(this.snd, other.snd);
  };

  //# Pair#fantasy-land/compose :: Pair a b ~> Pair b c -> Pair a c
  //.
  //. TK.
  //.
  //. ```javascript
  //. > Z.compose(Pair('b', true), Pair(1, 'a'))
  //. Pair(1, true)
  //. ```
  Pair.prototype['fantasy-land/compose'] = function compose(other) {
    return Pair(this.fst, other.snd);
  };

  //# Pair#fantasy-land/concat :: (Semigroup a, Semigroup b) => Pair a b ~> Pair a b -> Pair a b
  //.
  //. TK.
  //.
  //. ```javascript
  //. > Z.concat(Pair([1, 2, 3], [6, 5, 4]), Pair([4, 5, 6], [3, 2, 1]))
  //. Pair([1, 2, 3, 4, 5, 6], [6, 5, 4, 3, 2, 1])
  //. ```
  Pair.prototype['fantasy-land/concat'] = function concat(other) {
    return Pair(Z.concat(this.fst, other.fst), Z.concat(this.snd, other.snd));
  };

  //# Pair#fantasy-land/map :: Pair a b ~> (b -> c) -> Pair a c
  //.
  //. TK.
  //.
  //. ```javascript
  //. > Z.map(Math.sqrt, Pair('hello', 64))
  //. Pair('hello', 8)
  //. ```
  Pair.prototype['fantasy-land/map'] = function map(f) {
    return Pair(this.fst, f(this.snd));
  };

  //# Pair#fantasy-land/bimap :: Pair a b ~> (a -> b) -> (c -> d) -> Pair b d
  //.
  //. TK.
  //.
  //. ```javascript
  //. > Z.bimap(s => s + ' there', Math.sqrt, Pair('hello', 64))
  //. Pair('hello there', 8)
  //. ```
  Pair.prototype['fantasy-land/bimap'] = function bimap(f, g) {
    return Pair(f(this.fst), g(this.snd));
  };

  //# Pair#fantasy-land/ap :: Semigroup a => Pair a b ~> Pair a (b -> c) -> Pair a c
  //.
  //. TK.
  //.
  //. ```javascript
  //. > Z.ap(Pair('hello', Math.sqrt), Pair(' there', 64))
  //. Pair('hello there', 8)
  //. ```
  Pair.prototype['fantasy-land/ap'] = function ap(other) {
    return Pair(Z.concat(other.fst, this.fst), other.snd(this.snd));
  };

  //# Pair#fantasy-land/chain :: Semigroup a => Pair a b ~> (b -> Pair a c) -> Pair a c
  //.
  //. TK.
  //.
  //. ```javascript
  //. > Z.chain(n => Pair([n], n + 1), Pair([1], 2))
  //. Pair([1, 2], 3)
  //. ```
  Pair.prototype['fantasy-land/chain'] = function ap(f) {
    var result = f(this.snd);
    return Pair(Z.concat(this.fst, result.fst), result.snd);
  };

  //# Pair#fantasy-land/reduce :: Pair a b ~> ((c, a) -> c, c) -> c
  //.
  //. TK.
  //.
  //. ```javascript
  //. > Z.reduce(Z.concat, [1, 2, 3], Pair('irrelevant', [4, 5, 6]))
  //. [1, 2, 3, 4, 5, 6]
  //. ```
  Pair.prototype['fantasy-land/reduce'] = function reduce(f, x) {
    return f(x, this.snd);
  };

  //# Pair#fantasy-land/traverse :: Applicative f => Pair a b ~> (TypeRep f, b -> f c) -> f (Pair a c)
  //.
  //. TK.
  //.
  //. ```javascript
  //. > Z.traverse(Array, x => [x, x], Pair(0, 1))
  //. [Pair(0, 1), Pair(0, 1)]
  //. ```
  Pair.prototype['fantasy-land/traverse'] = function traverse(typeRep, f) {
    var pair = this;
    return Z.map(function(x) {
      return Pair(pair.fst, x);
    }, f(pair.snd));
  };

  //# Pair#fantasy-land/extend :: Pair a b ~> (Pair a b -> c) -> Pair a c
  //.
  //. TK.
  //.
  //. ```javascript
  //. > Z.extend(pair => Z.extract(pair) + 1, Pair('forever', 99))
  //. Pair('forever', 100)
  //. ```
  Pair.prototype['fantasy-land/extend'] = function extend(f) {
    return Pair(this.fst, f(this));
  };

  //# Pair#fantasy-land/extract :: Pair a b ~> () -> b
  //.
  //. TK.
  //.
  //. ```javascript
  //. > Z.extract(Pair('the answer is', 42))
  //. 42
  //. ```
  Pair.prototype['fantasy-land/extract'] = function extract() {
    return this.snd;
  };

  //# Pair#toString :: Pair a b ~> () -> String
  //.
  //. TK.
  //.
  //. ```javascript
  //. > Z.toString(Pair(1, 2))
  //. 'Pair(1, 2)'
  //. ```
  Pair.prototype.toString = function toString() {
    return 'Pair(' + Z.toString(this.fst) + ', ' + Z.toString(this.snd) + ')';
  };

  //# Pair.fst :: Pair a b -> a
  //.
  //. TK.
  //.
  //. ```javascript
  //. > Pair.fst(Pair('hello', 42))
  //. 'hello'
  //. ```
  Pair.fst = function fst(p) { return p.fst; };

  //# Pair.snd :: Pair a b -> b
  //.
  //. TK.
  //.
  //. ```javascript
  //. > Pair.snd(Pair('the answer is', 42))
  //. 42
  //. ```
  Pair.snd = Z.extract;

  //# Pair.swap :: Pair a b -> Pair b a
  //.
  //. TK.
  //.
  //. ```javascript
  //. > Pair.swap(Pair(1, 2))
  //. Pair(2, 1)
  //. ```
  Pair.swap = function(p) { return Pair(p.snd, p.fst); };

  return Pair;

}));

//. [Apply]:            v:fantasyland/fantasy-land#apply
//. [Bifunctor]:        v:fantasyland/fantasy-land#bifunctor
//. [Chain]:            v:fantasyland/fantasy-land#chain
//. [Extend]:           v:fantasyland/fantasy-land#extend
//. [Extract]:          v:fantasyland/fantasy-land#extract
//. [Fantasy Land]:     v:fantasyland/fantasy-land
//. [Foldable]:         v:fantasyland/fantasy-land#foldable
//. [Functor]:          v:fantasyland/fantasy-land#functor
//. [Ord]:              v:fantasyland/fantasy-land#ord
//. [Semigroup]:        v:fantasyland/fantasy-land#semigroup
//. [Semigroupoid]:     v:fantasyland/fantasy-land#semigroupoid
//. [Setoid]:           v:fantasyland/fantasy-land#setoid
//. [Traversable]:      v:fantasyland/fantasy-land#traversable
//. [type identifier]:  v:sanctuary-js/sanctuary-type-identifiers
