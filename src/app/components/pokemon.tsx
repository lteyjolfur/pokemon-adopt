import Pokedex from 'pokedex-promise-v2';
const P = new Pokedex();
import Image from "next/image";

// const GENDER = {
//     none: 0,
//     male: 1,
//     female: 2
// }

type Move = {
    name:string, type:string
}


type PokemonDetails = {
    name: string;
    sprite: string;
    hdSprite: string;
    selectedMoves?: Move[]
  };

const FALLBACK_SPRITE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/185.png';


const getPokemonDetails = async (pokemonNumber:number):Promise<PokemonDetails> => {
    try {
      // Fetch the Pokémon by its number
      const pokemon = await P.getPokemonByName(pokemonNumber); // Accepts both name and number
      const species = await P.getPokemonSpeciesByName(pokemonNumber);
      // Extract the name and sprite
      const name = pokemon.name;
      const sprite = pokemon.sprites.front_default || FALLBACK_SPRITE;
      const hdSprite = pokemon.sprites.other['official-artwork'].front_default || FALLBACK_SPRITE;

     console.log(pokemon.stats);

      console.log(`Name: ${name}`);
      console.log(`Sprite: ${sprite}`);

      const genderRate = species.gender_rate;

      if (genderRate === -1) {
        console.log(`${species.name} is genderless.`);
        //const gender = GENDER.none;
      } else {
        //const femalePercentage = (genderRate / 8) * 100;
        //const malePercentage = 100 - femalePercentage;
      }

      const moves = pokemon.moves.map(move => move.move.name);

      // Fetch details for each move to get their types
      const moveDetails = await Promise.all(
        moves.map(async (move) => {
          const moveData = await P.getMoveByName(move);
          return {
            name: moveData.name,
            type: moveData.type.name,
          };
        })
      );
  
      // Randomly select 4 moves
      const selectedMoves = moveDetails.sort(() => 0.5 - Math.random()).slice(0, 4);
  
      console.log(`Randomly selected moves for ${pokemon.name}:`);
      selectedMoves.forEach(move => {
        console.log(`- ${move.name} (${move.type})`);
      });

    return {name, sprite, hdSprite, selectedMoves}

    } catch (error) {
      console.warn('Error fetching Pokémon:', error);
      return {
        name: 'Sudowoodo',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/185.png',
        hdSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/185.png'}
    }
  };



export default async function Pokemon() {
    // max 1025
    const {name,hdSprite,selectedMoves} = await getPokemonDetails(Math.ceil(Math.random() * 151));
    //const {name,hdSprite} = await getPokemonDetails(146);


    return (
        <div className='bg-gray-400 border-r-4 p-3' >
        <Image
        src={hdSprite}
        alt={name}
        width={400}
        height={400}
      />
     {name}
        <div>
        Moves:
        {selectedMoves?.map((move:Move) => {
            return <><span key={move.name}>{move.name} {move.type}</span> <br/></>
        })}
        </div>
      </div>
    )
}