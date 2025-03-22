      {
        (Object?.keys(res)?.length > 0 && typeof res?.contactWiseExpense === 'object') &&
        <div className="mt-6">
          <h3 className="text-lg mb-1 font-medium">Expense</h3>
          <div className="grid 2xl:grid-cols-6 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 grid-cols-2 place-content-center gap-5 row-gap-0">
            <ExpenseCard name={'Total Expense'} value={res?.totalExpense} />

            {
              Object?.entries(res?.contactWiseExpense)?.map(([key, value]) => {
                return (
                  <ExpenseCard key={key} name={key} value={value} />
                )
              })
            }
          </div>
        </div>
      }
