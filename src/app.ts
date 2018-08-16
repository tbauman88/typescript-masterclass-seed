import * as _ from 'lodash';

// Type Queries
const man = {
  name: 'Tyler',
  age: 30
}

type Man = typeof man;
type PersonKeys = keyof Man;
type PersonTypes = Man[PersonKeys];

function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

const personName = getProperty(man, 'name');

// Mapped Types
interface Person {
  name: string;
  age: number;
}

const person: Person = {
  name: 'Tyler',
  age: 30
};

// “Readonly” Mapped Type
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
}

function freeze<T>(obj: T): MyReadonly<T> {
  return Object.freeze(obj);
} 

const newPerson = freeze(person);

// “Partial” Mapped Type
type MyPartial<T> = {
  [P in keyof T]?: T[P]
}

function updatePerson(person: Person, prop: MyPartial<Person>) {
  return { ...person, ...prop }
}

updatePerson(person, { name: 'Joe' });

// “Required” Mapped Type and Modifiers
const person1: MyRequried<Person> = {
  name: 'Tyler',
  age: 30
};

type MyRequried<T> = {
  -readonly [P in keyof T]-?: T[P];
}

function printAge(person: MyRequried<Person>) {
  return `${person.name} is ${person.age}`
}

const age = printAge(person1);

// “Pick” Mapped Type
const person2: MyPick<Person, 'name' | 'age'> = {
  name: 'Tyler',
  age: 30
};

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

// “Record” Mapped Type
let dictionary: Record<string, TrackStates> = {};

interface TrackStates {
  current: string;
  next: string;
}

const item: Record<keyof TrackStates, string> = {
  current: 'js02js9',
  next: '8nlksjsk'
}

dictionary[0] = item; // Numbers are coerced to String

// typeof and Type Guards
class Song {
  constructor(public title: string, public duration: string | number) {}
}

function getSongDuration(item: Song) {
  if (typeof item.duration === 'string') {
    return item.duration
  }
  const { duration } = item;
  const minutes = Math.floor(duration / 60000);
  const seconds = (duration / 1000) % 60;
  return `${minutes}:${seconds}`;
}

const songDurationFromString = getSongDuration(
  new Song('Wonderful Wonderful', '05:31')
);

const songDurationFromMS = getSongDuration(
  new Song('Wonderful Wonderful', 330000)
)

// instanceof and Type Guards
class Album {
  kind: 'album';
  constructor(public title: string, public duration: number) {}
}

class Playlist {
  kind: 'playlist';
  constructor(public name: string, public songs: Album[]) {}
}

function getItemName(item: Album | Playlist) {
  if(item instanceof Album) return item.title;
  return item.name;
}

const albumName = getItemName(new Album('Wonderful Wonderful', 300000));
const playlistName = getItemName(
  new Playlist('Best Albums', [new Album('The Man', 300000)])
);

// User Defined Type Guards
function isAlbum(item: any): item is Album {
  return item instanceof Album;
}

function getName(item: Album | Playlist) {
  if(isAlbum(item)) return item.title;
  return item.name;
}

// Literal Type Guards and "in" Operator
function isSong(item: any): item is Album {
  return 'title' in item;
}

function getKindName(item: Album | Playlist) {
  if(item.kind === 'album') return item.title;
  return item.name;
}

// Intersection Types
interface Order {
  id: string;
  amount: number;
  currency: string;
}

interface Stripe {
  type: 'stripe';
  card: string;
  cvc: string;
}

interface PalPal {
  type: 'paypal';
  email: string;
}

type CheckoutCard = Order & Stripe;
type CheckoutPalPal = Order & PalPal;
// type CheckoutABC = Order & { name: string };

const order: Order = {
id: 'xj27s',
  amount: 100,
  currency: 'CAD'
};

const orderCard: CheckoutCard = {
  ...order,
  type: 'stripe',
  card: '1000 2000 3000 4000',
  cvc: '123'
};

const orderPayPal: CheckoutPalPal = {
  ...order,
  type: 'paypal',
  email: 'abc@def.com'
}

// Discriminated (Tagged) Unions
type Payload = CheckoutCard | CheckoutPalPal;

function checkout(payload: Payload) {
  if (payload.type === 'stripe') {
    console.log(payload.card, payload.cvc);
  }
  if (payload.type === 'paypal') {
    console.log(payload.email);
  }
}

// Interfaces vs Type Aliases
interface Item {
  name: string;
}

interface Artist extends Item {
  songs: number;
}

interface Artist {
  getSongs(): number;
}

type Artist2 = { name: string } & Item;

const newArtist: Artist = {
  name: 'ABC',
  songs: 5,
  getSongs() {
    return this.songs;
  }
}

// Interfaces vs Classes
interface Band {
  name: string;
}

class BandCreator /*implements Band*/ {
  constructor(public name: string) {}
}

function groupFactory({ name }): BandCreator {
  return new BandCreator(name);
}

groupFactory({ name: 'Tyler' });

// Function Generics
class Cake {
  constructor(private name: string, private price: number) {}
}

class List<T> {
  private list: T[];

  addItem(item: T): void {
    // this.list.push(item);
  }

  getList(): T[] {
    return this.list;
  }
};

const list = new List<Cake>();
list.addItem(new Cake('Birthday', 15));
const cakes = list.getList();

class Coupon {
  constructor(private name: string) {}
}

const anotherList = new List<Coupon>();
anotherList.addItem(new Coupon('CAKE25'));

// Function Overloads
function reverse(str: string): string;
function reverse<T>(arr: T[]): T[];

function reverse<T>(stringOrArray: string | T[]): string | T[] {
  if (typeof stringOrArray === 'string') {
    return stringOrArray
      .split('')
      .reverse()
      .join('');
  }
  return stringOrArray.slice().reverse();
}

reverse('Birthday');
reverse(['frosting', 'vanilla', 'smarties']);

// Numeric Enums and Reverse Mappings
enum Sizes { Small, Medium, Large }
enum Sizes { ExtraLarge = 3 }
const selectedSizes = 2;

// String Enums and Inlining Members
const enum Size { Small = 'small', Medium = 'medium', Large = 'large' }
let selected: Size = Size.Small;
function updateSize(size: Size): void {
  selected = size
}
updateSize(Size.Large);

// Writing Declaration Files
_.chunk([1,2,3,4], 2);

// Augmenting Modules with Declarations
_.mixin({
  log(item: string) {
    console.log(':::', item)
  }
});

// Emitting Declaration Files from tsc
export class Gym {
  constructor(public name: string) {}
  athlete(age: number) {}
}