/*
1. Insert all OpenLibrary IDs into ids array.
2. The run file with Bun. It will fetch all covers and insert them into a CSV with ; as delimiter
3. We can manually fill in the errors stored in errors.txt
4. merge R1.csv & R1Imgs.csv :: Sample Files are includes
5. Put R1 back into src/routes/books
*/

import { appendFileSync } from "fs";

const ids = Object.freeze( [
    "OL83715W",
    "OL8305185W",
    "OL8062007W",
    "OL7927002M",
    "OL7318016M",
    "OL54610936M",
    "OL52209904M",
    "OL51149627M",
    "OL46535432M",
    "OL4288870W",
    "OL36675855M",
    "OL35996435M",
    "OL34534882W",
    "OL33857307M",
    "OL32754021M",
    "OL32387462M",
    "OL30809615W",
    "OL29506523M",
    "OL28635528M",
    "OL28623980W",
    "OL28321311M",
    "OL27846773W",
    "OL27810387W",
    "OL278022W",
    "OL27343095M",
    "OL27275984W",
    "OL27157451M",
    "OL25807247W",
    "OL25328015W",
    "OL24340933W",
    "OL24207868M",
    "OL24149728W",
    "OL22089096W",
    "OL21209060W",
    "OL20843696W",
    "OL20787306W",
    "OL20537401W",
    "OL20334242W",
    "OL20153626W",
    "OL20046006W",
    "OL1968368W",
    "OL19663289W",
    "OL18821160W",
    "OL18201749W",
    "OL17715915W",
    "OL17551552W",
    "OL1751051W",
    "OL17043758W",
    "OL16568840W",
    "OL15540668W"
] );

const openlib = ( id ) => ( `https://openlibrary.org/works/${ id }.json` )

async function* getData () {
    let id = 0;
    while ( true ) {
        const url = openlib( ids[ id++ ] );
        const data = await fetch( url ).then( r => r.json() );

        yield data;
    }
}; const gen = getData();

const map = ( i, data ) => {
    if ( !data ) {
        return ( { index: i, id: ids[ i ], title: null, cover: null } )
    };

    const cover = data.covers ? data.covers[ 0 ] : null;
    return {
        index: i,
        id: ids[ i ],
        title: data?.title?.split( "[" )[ 0 ].trim(),
        cover: cover > 100 ? cover : null
    };
};


appendFileSync( "./R3Imgs.csv", `OLID;title;coverId\n` );
ids.slice( 0, 101 ).forEach( async ( e, i ) => {
    const data = await gen.next();
    const c = map( i, data.value );
    console.log( c );

    if ( c.cover === null ) appendFileSync( "./errors.txt", c.id + '\n' );
    const logged = `${ c.id };${ c.title };${ c.cover }\n`;
    appendFileSync( "./R3Imgs.csv", logged );
} );