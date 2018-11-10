// getAssetsForSolutionAndSite(
//     solutionId: "",
//     siteId: "",
//     profileId: ""
//     search: {
//         query: "vehicle",
//         sort: {
//             order: 'desc',
//             fields: ['name', 'category']
//         }
//         paginate: {
//             size: 50,
//             nextToken: "something"
//         }
//     }
// }

// optional: query_string name:query* and cat:another*
// how to handle related properties in the above?

// {
//     size: 10,
//     index: 'sensors',
//     body: {
//         query: {
//             bool: {
//                 must: [
//                     { match: { solution_id: '0000-0000' } },
//                     { match: { site_id: '0000-0000' } },
//                     {
//                         query_string: {
//                             query: 'vehicl*',
//                             fields: ['name', 'categories']
//                         }
//                     }
//                 ]
//             }
//         },
//         sort: ['name.raw', 'categories.raw', '_id'],
//         search_after: ['somename', 'somecat', 'someid']
//     }
// }

// a query must always have a size and an index
// the primary goal is to build a set of abstractions that construct that body
// eg:

const queryBuilder = new QueryBuilder(10, 'sensors');

const query = queryBuilder
    .where({ solution_id: '0000-0000', site_id: '0000-0000' })
    .sort({ name: 'asc' }) // need to confirm these sorts exist on the fields metadata
    .sort({ category: 'desc' }) // objects keys don't stay in order
    .search({ query: 'vehicle' }) // this could become more complicated depending on filtering
    .withToken(token);

const results = await query.execute();

// chainability ex:

class Chainable {
    hello() {
        console.log('hello');
        return this;
    }
}

const chainable = new Chainable();

chainable.hello().hello();

// easily testable without need for e2e (can be confident elastic interprets body properly)
// easily configurable/extendable for whatever other requirements appear (just add a new method)
// cleaner; more familiar dsl over elastic stuff; easier to use than current implementation which hacks together a bunch of params with if / elses etc
