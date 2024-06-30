import data from "@/util/mock.json"
import {useEffect} from "react";
import {Card, CardBody, CardHeader} from "@nextui-org/card";

export default function Alerts() {

    const user = data.user


    return (
        <div className={"w-full h-full flex flex-col p-6"}>
            <p className={"text-3xl"}>Your Alerts:</p>
            <br/>
            <div className={"flex flex-col gap-3"}>
                {user.alerts.map(alert => (
                    <Card className={alert.severity == "error"? "bg-red-500" : "bg-amber-300"}>
                        <CardHeader>
                            <p className={"text-2xl"}>{alert.title}</p>
                        </CardHeader>
                        <CardBody>
                            {alert.message}
                            <br/>
                            <br/>
                        </CardBody>
                    </Card>
                ))}
            </div>

        </div>
    );
}