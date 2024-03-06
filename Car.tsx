import React, {useEffect, useState} from 'react';
import moment from 'moment';
import "./Car.css";

interface Model {
    model_id: number;
    man_id: number;
    model_name: string;
    // Other properties...
}

interface Mans {
    man_id: string;
    man_name: string;
    is_car: string;
    is_spec: string;
    is_moto: string;
};

interface Product {
    man_id: number;
    model_id: number;
    category_id: number;
    for_rent: boolean;
    price: number;
    photo: string;
    car_id: number;
    photo_ver: number;
    prod_year: number
    customs_passed: boolean;
    views: number;
    order_date: string;
    price_usd: number;
    price_value: number;
    right_wheel: boolean;
    car_run_km: number;
    engine_volume: number;
    gear_type_id: number;
    fuel_type_id: number;

}

interface CarProps {
    photo: string;
    car_id: number;
    photo_ver: number;
    mans: Mans[];
    man_id: number;
    prod_year: number;
    customs_passed: boolean;
    _models: Model[];
    car: Product;
}


function Car(props: CarProps) {
    const {photo, car_id, photo_ver, prod_year, customs_passed, mans, man_id, car, _models} = props;
    const manufacturer = mans.find((man) => parseInt(man.man_id) === man_id);
    const manufacturerName = manufacturer ? manufacturer.man_name : "Manufacturer not found";
    const date = moment(car.order_date);

    const timeAgo = date.fromNow();
    const modelLink: string = `https://api2.myauto.ge/ka/getManModels?man_id=${car.man_id}`;
    const [models, setModels] = useState<Model[]>([..._models]);
    const fetchModel = async () => {
        try {
            const response = await fetch(modelLink);
            const newModels = await response.json();
            setModels([...models, ...newModels.data]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchModel();
    }, []);

    const [model, setModel] = useState<Model | undefined>(undefined);
    const [modelName, setModelName] = useState<string>('');

    useEffect(() => {
        console.log(car.car_id, models.length);
        setModel(models.find((mod) => mod.man_id === man_id && mod.model_id === car.model_id));
    }, [models]);

    useEffect(() => {
        setModelName(model ? model.model_name : "Model not found");
    }, [model]);

    interface FuelType {
        name: string;
        value: number;
    }

    interface Gear {
        name: string;
        value: number;
    }

    const fuelTypes: FuelType[] = [
        {name: "ბენზინი", value: 2},
        {name: "დიზელი", value: 3},
        {name: "ელექტრო", value: 7},
        {name: "დატენვადი ჰიბრიდი", value: 10},
        {name: "ჰიბრიდი", value: 6},
        {name: "თხევადი გაზი", value: 9},
        {name: "ბუნებრივი გაზი", value: 8},
        {name: "წყალბადი", value: 12},
    ];

    const gears: Gear[] = [
        {name: "მექანიკა", value: 1},
        {name: "აუტომატიკა", value: 2},
        {name: "ტიპტრონიკი", value: 3},
        {name: "ვარიატორი", value: 4},
    ];


    return (
            <div className='main'>

                <div className="manq">
                    <img
                        src={`https://static.my.ge/myauto/photos/${photo}/thumbs/${car_id}_1.jpg?v=${photo_ver}`} alt=""
                        />
                </div>

                <div className="info">
                    <div className="containerL ">
                        <div className="row align-items-start">

                            <div className="col">
                                <div className='col-name'>
                                    <div className="nameYear ">
                                        <div className='name&year' ><span
                                            className='names'> {manufacturerName} {modelName}  </span> <span
                                            className='year'> {prod_year} წ </span></div>
                                    </div>
                                </div>
                            </div>

                            <div className="col">
                                <div className='col-ganbajeba'>
                                    <div className="container-1 d-flex align-items-center">
                                        <div className="ganbajeba-container"
                                             style={{marginRight: '0rem', marginLeft: '0.5rem'}}>
                                            <div
                                                className="ganbajeba">{customs_passed ? "განბაჟებული" : "განუბაჟებელი"}</div>
                                        </div>
                                        <div className="flag-container"
                                             style={{marginLeft: '0.5rem', marginRight: '0.5rem'}}>
                                            <div className="flag">
                                                <img src="./flag - geo.png" alt="geoflag"/>
                                            </div>
                                        </div>
                                        <div className="country-container" >თბილისი</div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className='mainInfos'>
                        <div className="container text-center">
                            <div className="row stats-wrapper">
                                <div className="col-6 col-sm-4 d-flex align-items-center  ">
                                    <div className='motorIcon'>
                                        <img src="./motor.png" alt="motoricon"/>
                                    </div>
                                    <div className="ml-2">
                                        <p>{car.engine_volume / 1000} {fuelTypes && fuelTypes.find((fuel) => fuel.value === car.fuel_type_id)?.name}  </p>
                                    </div>
                                </div>

                                <div className="col-6 col-sm-4 d-flex align-items-center ">
                                    <div className='speedIcon'>
                                        <img src="./speed.png" alt="speedicon"/>
                                    </div>
                                    <div className="ml-2">
                                        <p> {car.car_run_km && car.car_run_km} კმ </p>
                                    </div>
                                </div>




                                <div className="stats-placeholder"></div>



                                <div className="col-6 col-sm-4 d-flex align-items-center ">
                                    <div className='avtomatikIcon'>
                                        <img src="./avtomatic.png" alt="avt-licon"/>
                                    </div>
                                    <div className="ml-2">
                                        <p> {gears && gears.find((gear) => gear.value === car.gear_type_id)?.name}</p>
                                    </div>

                                </div>


                                <div className="col-6 col-sm-4 d-flex align-items-center ">
                                    <div className='sacheIcon'>
                                        <img src="./sache.png" alt="wheelicon"/>
                                    </div>
                                    <div className="ml-2">
                                        <p>{car.right_wheel ? "მარჯვნივ" : "მარცხნივ"}</p>
                                    </div>
                                </div>

                                <div className="price col-6 col-sm-4 d-flex align-items-center ">
                                    <div className=''>
                                        <div className="price_num" >
                                            <div className="gcarprice"> {car.price_value} <span className='lari-wrapper'>₾</span></div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="row">
                                <div className="col ">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <div className='promotion'>
                                                <img src="./promotion.png" alt="promotion"/>
                                            </div>
                                            <div className="ml-2">
                                                <div className='views&whenUploaded text-sm-center time-views'>{car.views} ნახვა • {timeAgo} </div>
                                            </div>
                                        </div>

                                        <div className='tools'>

                                            <button className='note'><img src="./Vector.png" alt="lariicon"/></button>
                                            <button className='shedareba'><img src="./Shape.png" alt="lariicon"/></button>
                                            <button className='favorite'><img src="./Path (Stroke).png" alt="lariicon"/></button>

                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>


                </div>





            </div>
    )
}

export default Car;

