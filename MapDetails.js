import { fireDB } from './firebase'

const MapDetailsCollectionRef = fireDB.collection('mapDetails');

console.log(MapDetailsCollectionRef);

class MapDetails {
    constructor({ uid, name, coords }) {
        this.uid = uid,
        this.name = name;
        this.coords = coords
    }

    async addMapDetails() {
        await MapDetailsCollectionRef.add({
            id: Math.floor(Math.random() * 10000),
            uid: this.uid,
            name: this.name,
            coords: this.coords,
            created: (new Date()).toISOString(),
        });
    }

    async updateMapDetails (detailsToUpdate = {}) {
        const ref = MapDetailsCollectionRef.doc(this.uid);
        try {
            await ref.set({
              ...detailsToUpdate
            }, {merge: true});
        } catch (error) {
            console.log("inside error here ==", {error});
        }
    }

    async deleteMapDetails () {
        // To Do as home work
    }
}

export default MapDetails
