import Estate from "../../models/estate";
import send from '@polka/send-type';

export async function get(req, res) {
    try {
        await Estate.aggregate([
            { 
                $sort: { price: -1 } 
            },
            {
                $group: {
                    _id: null,
                    currency: {$push: "$currency"},
                    maxPrice: {$max: "$price"},
                    minPrice: {$min: "$price"},
                    maxArea: {$max: "$details.area.g"},
                    minArea: {$min: "$details.area.g"},
                    maxRooms: {$max: "$details.rooms"},
                    minRooms: {$min: "$details.rooms"},
                    countries: {$push: "$adress.country"},
                    cities: {$push: "$adress.city"}
                }
            },
            {
                $project: {
                    _id: 0,
                    maxPrice: 1, minPrice: 1, maxArea: 1, minArea: 1, maxRooms: 1, minRooms: 1, currency: {$first: "$currency"},
                    // remove duplicates
                    countries: { $setUnion: [ "$countries", [] ] },
                    cities: { $setUnion: [ "$cities", [] ] }
                }
            }
            
        ])
        .then(r => {return send(res, 200, r[0])});
    } catch (error) {
        send(res, 500, error)
    }
}