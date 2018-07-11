import connectToPg from './connectToPg';

const Model = () => {
    connectToPg.query(
        `CREATE TABLE IF NOT EXISTS "LagosStaff" (
            "id" SERIAL PRIMARY KEY,
            "staffId" VARCHAR,
            "lastName" VARCHAR,
            "firstName" VARCHAR,
            "middleName" VARCHAR,
            "mobileNumber" VARCHAR,
            "scheduleDate" VARCHAR,
            "code" VARCHAR,
            "status" VARCHAR
        )`
    )
        .then(tableData => console.log('LagosStaff table created successfully', tableData))
        .catch(error => console.error('There was a problem creating tables', error));
};

export default Model;
