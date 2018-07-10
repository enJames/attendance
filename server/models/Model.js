import connectToPg from './connectToPg';

const Model = () => {
    connectToPg.query(
        `CREATE TABLE IF NOT EXISTS "LagosStaff" (
            "id" SERIAL PRIMARY KEY,
            "staff_id" VARCHAR,
            "last_name" VARCHAR,
            "first_name" VARCHAR,
            "middle_name" VARCHAR,
            "mobile_number" VARCHAR,
            "schedule_date" VARCHAR
        )`
    )
        .then(tableData => console.log('LagosStaff table created successfully', tableData))
        .catch(error => console.error('There was a problem creating tables', error));
};

export default Model;
