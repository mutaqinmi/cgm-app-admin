export default function ErrorSigninPopup(props: {message: string}){
    return <div className="w-full bg-red-200 text-red-500 p-4 rounded-md my-4 text-center text-sm">
        {props.message}
    </div>
}