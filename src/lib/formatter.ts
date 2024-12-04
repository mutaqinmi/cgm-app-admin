/**
 * This method is used for converting string to formatted currency in Rupiah
 */

export default function numberFormatter(value: string){
    return 'Rp. ' + value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}