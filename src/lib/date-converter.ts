/**
 * This method is used for converting string format yyyy-mm to string format M yyyy
 */

export function toString(datetime: string): string {
    const date = datetime.split('-')[1];
    const year = datetime.split('-')[0];
    let dateString = "";

    if(date === "01") {
        dateString = "Januari";
    } else if(date === "02") {
        dateString = "Februari";
    } else if(date === "03") {
        dateString = "Maret";
    } else if(date === "04") {
        dateString = "April";
    } else if(date === "05") {
        dateString = "Mei";
    } else if(date === "06") {
        dateString = "Juni";
    } else if(date === "07") {
        dateString = "Juli";
    } else if(date === "08") {
        dateString = "Agustus";
    } else if(date === "09") {
        dateString = "September";
    } else if(date === "10") {
        dateString = "Oktober";
    } else if(date === "11") {
        dateString = "November";
    } else if(date === "12") {
        dateString = "Desember";
    }

    return `${dateString} ${year}`;
}

export function toDate(datetime: string): string {
    const date = datetime.split('-')[1];
    const year = datetime.split('-')[0];
    let dateString = "";

    if(date === "Januari") {
        dateString = "01";
    } else if(date === "Februari") {
        dateString = "02";
    } else if(date === "Maret") {
        dateString = "03";
    } else if(date === "April") {
        dateString = "04";
    } else if(date === "Mei") {
        dateString = "05";
    } else if(date === "Juni") {
        dateString = "06";
    } else if(date === "Juli") {
        dateString = "07";
    } else if(date === "Agustus") {
        dateString = "08";
    } else if(date === "September") {
        dateString = "09";
    } else if(date === "Oktober") {
        dateString = "10";
    } else if(date === "November") {
        dateString = "11";
    } else if(date === "Desember") {
        dateString = "12";
    }

    return `${dateString}-${year}`;
}