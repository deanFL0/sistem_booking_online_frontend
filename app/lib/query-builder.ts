type Sort = {
    id: string
    desc: boolean
}

type Pagination = {
    pageIndex: number
    pageSize: number
}

type RangeValue = {
    min?: unknown
    max?: unknown
}

type Filters = Record<string, unknown>

type BuildQueryParamsOptions = {
    pagination: Pagination
    sorting: Sort[]
    filters: Filters
}

function isRangeValue(
    value: unknown
): value is RangeValue {
    return (
        typeof value === "object" &&
        value !== null &&
        ("min" in value || "max" in value)
    )
}

export function buildQueryParams({
    pagination,
    sorting,
    filters,
}: BuildQueryParamsOptions) {
    const params = new URLSearchParams()

    /*
     |--------------------------------------------------------------------------
     | Pagination
     |--------------------------------------------------------------------------
     */

    params.set("page", String(pagination.pageIndex + 1))
    params.set("per_page", String(pagination.pageSize))

    /*
     |--------------------------------------------------------------------------
     | Sorting
     |--------------------------------------------------------------------------
     */

    if (sorting.length > 0) {
        const sort = sorting[0]

        params.set(
            "sort",
            sort.desc ? `-${sort.id}` : sort.id
        )
    }

    /*
     |--------------------------------------------------------------------------
     | Filters
     |--------------------------------------------------------------------------
     */

    Object.entries(filters).forEach(([key, value]) => {
        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return
        }

        /*
         |--------------------------------------------------------------------------
         | Array filters
         |--------------------------------------------------------------------------
         */

        if (Array.isArray(value)) {
            params.set(`filter[${key}]`, value.join(","))
            return
        }

        /*
         |--------------------------------------------------------------------------
         | Range filter
         |--------------------------------------------------------------------------
         */

        if (isRangeValue(value)) {
            if (value.min !== undefined) {
                params.set(
                    `filter[min_${key}]`,
                    String(value.min)
                )
            }

            if (value.max !== undefined) {
                params.set(
                    `filter[max_${key}]`,
                    String(value.max)
                )
            }

            return
        }

        /*
         |--------------------------------------------------------------------------
         | Primitive filters
         |--------------------------------------------------------------------------
         */

        params.set(`filter[${key}]`, String(value))
    })

    return params
}