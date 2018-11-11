const snakeCase = function(string) {
    return string.replace(/([A-Z])/g, function($1) {
        return '_' + $1.toLowerCase();
    });
};

const request = {
    solutionId: 'a-solution-id',
    siteId: 'a-site-id',
    profileId: 'a-profile-id',
    search: {
        query: 'vehicle',
        sort: [
            {
                field: 'name',
                order: 'desc'
            },
            {
                field: 'category',
                order: 'asc'
            }
        ],
        paginate: {
            size: 50,
            nextToken: 'someNextToken'
        }
    }
};

interface Query {
    size: number;
    index: string;
    body: object;
}

interface Match {
    match: {
        [key: string]: string;
    };
}

interface QueryString {
    query: string;
    fields: string[];
}

interface Sort {
    [key: string]: {
        order: string;
    };
}

interface SortParam {
    field: string;
    order: 'asc' | 'desc';
}

interface QueryBody {
    query: {
        bool: {
            must: (Match | QueryString)[];
        };
    };
    sort: Sort[];
    search_after: string[];
}

const body = {
    search_after: ['asd']
};

class QueryBuilder {
    private size = 50;
    private index: string;
    private body: QueryBody = {
        query: {
            bool: {
                must: []
            }
        },
        sort: [{ _id: { order: 'asc' } }],
        search_after: []
    };

    constructor(index: string) {
        this.index = index;
    }

    public debug() {
        console.log(this);
        return this;
    }

    public pageSize(size: number) {
        this.size = size;
        return this;
    }

    public where(conditions: object) {
        const keys = Object.keys(conditions);
        for (let key of keys) {
            const value = conditions[key];
            const snaked = snakeCase(key);
            const match = { match: { [snaked]: value } };
            this.body.query.bool.must.push(match);
        }
        return this;
    }

    // order is significant, we always want _id to be last
    public sort(param: SortParam) {
        const raw = `${param.field}.raw`;
        const sort = { [raw]: { order: param.order } };
        this.body.sort.unshift(sort);
        return this;
    }

    public search(query: string, fields) {
        // use fields from model def
        const queryString: QueryString = {
            query,
            fields
        };
        this.body.query.bool.must.push(queryString);
        return this;
    }

    public withToken() {
        // all that parsing crap; set search_after
        return this;
    }
}

const { solutionId, siteId } = request;

new QueryBuilder('sensors')
    .pageSize(20)
    .where({ solutionId, siteId })
    .sort(request.search.sort[0] as SortParam)
    .sort(request.search.sort[1] as SortParam)
    .search(request.search.query, ['asd', 'qwe'])
    .debug();
