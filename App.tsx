import React, {useState, useEffect, ChangeEvent} from 'react';
import Car from './Car';
import Select from 'react-select';
import "./App.css";

function App() {

    //links
    const manuLink: string = 'https://static.my.ge/myauto/js/mans.json';
    const catLink: string = 'https://api2.myauto.ge/ka/cats/get';
    const modelLink: string = 'https://api2.myauto.ge/ka/getManModels?man_id=24';
    const productLink: string = `https://api2.myauto.ge/ka/products`;


    //constructors
    interface Product {
        man_id: number;
        model_id: number;
        category_id: number;
        for_rent: boolean;
        price: number;
        photo: string;
        car_id: number;
        photo_ver: number;
        prod_year: number;
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

    interface Mans {
        man_id: string;
        man_name: string;
        is_car: string;
        is_spec: string;
        is_moto: string;
    }

    interface Model {
        model_id: number;
        man_id: number;
        model_name: string;
        // Other properties...
    }

    interface Cats {
        category_id: number;
        category_type: number;
        has_icon: number;
        title: string;
        seo_title: string;
        vehicle_types: number[];
    }

    const [manu, setManu] = useState<Mans[]>([]);
    const [model, setModel] = useState<Model[]>([]);
    const [cat, setCat] = useState<Cats[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedDealTypes, setSelectedDealTypes] = useState<string[]>([]);
    const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
    const [selectedModels, setSelectedModels] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(Infinity);
    const [selectedPeriod, setSelectedPeriod] = useState<string>('');
    const [selectedSortOption, setSelectedSortOption] = useState<string>(''); // Added state variable
    const [isFiltering, setIsFiltering] = useState(false);


    //fetching data
    const fetchManu = async () => {
        try {
            const response = await fetch(manuLink);
            const manus: Mans[] = await response.json();
            setManu(manus);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchModel = async () => {
        try {
            const response = await fetch(modelLink);
            const models = await response.json();
            setModel(models.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchCats = async () => {
        try {
            const response = await fetch(catLink);
            const cats = await response.json();
            setCat(cats.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchManu();
        fetchModel();
        fetchCats();
    }, []);

    //Options
    interface Option {
        value: string;
        label: string;
    }

    const sortOptions: Option[] = [
        {value: '1', label: 'Decreasing date'},
        {value: '2', label: 'Increasing date'},
        {value: '3', label: 'Decreasing price'},
        {value: '4', label: 'Increasing price'},
        {value: '5', label: 'Decreasing mileage'},
        {value: '6', label: 'Increasing mileage'},
    ];


    const sortPeriod: Option[] = [
        {value: '1h', label: '1 საათი'},
        {value: '2h', label: '2 საათი'},
        {value: '3h', label: '3 საათი'},
        {value: '1d', label: '1 დღე'},
        {value: '2d', label: '2 დღე'},
        {value: '3d', label: '3 დღე'},
        {value: '1w', label: '1 კვირა'},
        {value: '3w', label: '2 კვირა'},
        {value: '3w', label: '3 კვირა'},
    ];


    // Period/Sort Dropdown components

    const PeriodDropdown = () => {
        const handlePeriodChange = (selectedOption: Option | null) => {
            const selectedValue = selectedOption ? selectedOption.value : '';
            setSelectedPeriod(selectedValue);
        };

        return (
            <div className='period'>
                <label htmlFor="period"></label>
                <Select
                    id="period"
                    value={sortPeriod.find((option) => option.value === selectedPeriod)}
                    options={sortPeriod}
                    onChange={handlePeriodChange}
                />
            </div>
        );
    };


    const SortDropdown = () => {
        const handleSortChange = (selectedOption: Option | null) => {
            const selectedValue = selectedOption ? selectedOption.value : '';
            setSelectedSortOption(selectedValue);
        };

        return (
            <div className='sort'>
                <label htmlFor="sort"></label>
                <Select
                    id="sort"
                    value={sortOptions.find((option) => option.value === selectedSortOption)}
                    options={sortOptions}
                    onChange={handleSortChange}
                />
            </div>
        );
    };

    // ...


    //pages
    const [pageValue, setPageValue] = useState(1);

    const handlePageButtonClick = (value: number) => {
        setPageValue(value);
    };
    //////////////////////////////////////////////
    //models
    const [result, setResult] = useState<string>('');


    useEffect(() => {
        function filterManufacturersByMakeNames() {

            const filteredManufacturers = manu.filter(manufacturer =>
                selectedMakes.includes(manufacturer.man_id)
            );

            const formattedManufacturers = filteredManufacturers.map(manufacturer => {
                const matchingModels = selectedModels
                    .filter(mode => MakeModels.find(model => model.model_name === mode)?.man_id.toString() === manufacturer.man_id)
                    .map(model => MakeModels.find(mode => mode.model_name === model)?.model_id.toString())
                    .join('.');

                if (matchingModels) {
                    return `${manufacturer.man_id}.${matchingModels}`;
                } else {
                    return manufacturer.man_id.toString();
                }
            });

            return formattedManufacturers;
        }

        const result = filterManufacturersByMakeNames().join('-');
        setResult(result);
        console.log(result);

    }, [selectedMakes, selectedModels, manu]);

    const [MakeModels, setMakeModels] = useState<Model[]>([]);


    const fetchModelData = async (url: string): Promise<any> => {
        const response = await fetch(url);
        const data = await response.json();
        return data.data;
    };

    useEffect(() => {
        const fetchDataFromModelLinks = async (): Promise<any[]> => {
            const modelLinks = selectedMakes.map(man => `https://api2.myauto.ge/ka/getManModels?man_id=${man}`);
            const fetchPromises = modelLinks.map(fetchModelData);
            const all = await Promise.all(fetchPromises);
            return all.flat(); // Flatten the array before returning
        };

        fetchDataFromModelLinks()
            .then(data => {
                setMakeModels(data);
                console.log(data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [selectedMakes]);
    //vfetchavt modelebs ramdenjerac manufacturebi sheicvleba


    //fetch sorted products
    const fetchProduct = async () => {
        try {
            const queryParameters = new URLSearchParams({
                TypeID: '0',
                ForRent: selectedDealTypes.join(','),
                // Mans: selectedMakes.join('-'),
                Mans: selectedModels.length === 0 ? selectedMakes.join('-') : result,
                Cats: selectedCategories.join('.'),
                PriceFrom: minPrice.toString(),
                PriceTo: maxPrice.toString() !== 'Infinity' ? maxPrice.toString() : '',
                Period: selectedPeriod,
                SortOrder: selectedSortOption,
                Page: pageValue.toString(),
            });

            const response = await fetch(`${productLink}?${queryParameters}`);
            const products = await response.json();
            console.log(products);
            setFilteredProducts(products.data.items);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFilterButtonClick = () => {
        setIsFiltering(true);
    };

    useEffect(() => {
        if (isFiltering) {
            fetchProduct();
            setIsFiltering(false);
        }
    }, [isFiltering]);


    useEffect(() => {
        fetchProduct();
    }, [pageValue, selectedSortOption, selectedPeriod]);

    const getCar = (car: Product): JSX.Element => {
        return (
            <Car
                key={car.car_id}
                car={car}
                _models={model}
                mans={manu}
                photo={car.photo}
                car_id={car.car_id}
                photo_ver={car.photo_ver}
                prod_year={car.prod_year}
                customs_passed={car.customs_passed}
                man_id={car.man_id}
            />
        );
    };


    //return App components
    return (

        //selecting make,deal type,modelcategory
        <div className="app">

            <div className="nav-bar">
                <div className="inner-nav">
                    <div className='logo'>
                        <img src="./image 2.png" alt="Logo" />
                    </div>
                </div>
            </div>

            <div className="main-page">
                <div>
                    <div className='card-body'>

                        <div className='container'>
                            <div className='row'>
                                <div className='col d-flex justify-content-between'>
                                    <img src="./car.png" alt="car-Logo" id='car-logo' className="image-full-width"/>
                                    <img src="./tractor.png" alt="Logo" id='icon' className="image-full-width"/>
                                    <img src="./moto.png" alt="moto-Logo" id='icon' className="image-full-width"/>
                                </div>
                            </div>
                        </div>


                        <div id='input'>
                            <label>გარიგების ტიპი</label>
                            <Select
                                isMulti
                                closeMenuOnSelect={false}
                                value={selectedDealTypes.map((type) => ({
                                    value: type,
                                    label: type === '0' ? 'For Rent' : 'For Sale',
                                }))}
                                options={[
                                    {value: '0', label: 'For Rent'},
                                    {value: '1', label: 'For Sale'},
                                ]}
                                onChange={(selectedOptions) =>
                                    setSelectedDealTypes(selectedOptions.map((option) => option.value))}
                            />
                        </div>

                        <div id='input'>
                            <label>მწარმოებელი</label>
                            <Select
                                isMulti
                                closeMenuOnSelect={false}
                                value={selectedMakes.map((make) => ({
                                    value: make,
                                    label: manu.find((man) => man.man_id === make)?.man_name
                                }))}
                                options={manu.map((man) => ({value: man.man_id, label: man.man_name}))}
                                onChange={(selectedOptions) =>
                                    setSelectedMakes(selectedOptions.map((option) => option.value))}
                            />
                        </div>


                        <div id='input'>
                            <label>მოდელი</label>
                            <Select
                                isMulti
                                closeMenuOnSelect={false}
                                value={selectedModels.map((model) => ({
                                    value: model,
                                    label: model,
                                }))}
                                options={MakeModels.map((mod) => ({
                                    value: mod.model_name,
                                    label: mod.model_name,
                                }))}
                                onChange={(selectedOptions) =>
                                    setSelectedModels(selectedOptions.map((option) => option.value))}
                            />
                        </div>


                        <div id='input'>
                            <label>კატეგორია </label>
                            <Select
                                isMulti
                                closeMenuOnSelect={false}
                                value={selectedCategories.map((category) => ({
                                    value: category.toString(),
                                    label: cat.find((cat) => cat.category_id === parseInt(category))?.title
                                }))}
                                options={cat.map((c) => ({value: c.category_id.toString(), label: c.title}))}
                                onChange={(selectedOptions) =>
                                    setSelectedCategories(selectedOptions.map((option) => option.value))}
                            />
                        </div>

                        <div className='container'>

                            <div className="row align-items-start mb-2">
                                <div className="col">
                                    <div className="d-flex justify-content-between  align-items-center">
                                        <div >
                                            <label> ფასი </label>
                                        </div>
                                        <div >
                                            <img src="./Component 1.png" alt="switch"/>
                                        </div>

                                    </div>

                                </div>
                            </div>


                            <div className="row align-items-start ">

                                <div className="col">
                                    <div className="container-price d-flex align-items-center">

                                        <div className="price_inputs">
                                            <input type="number" className="range" placeholder='დან' value={minPrice}
                                                   onChange={(e) => setMinPrice(parseInt(e.target.value))}/>
                                        </div>
                                        <div className='dash' style={{margin: '0 0.5rem'}}>
                                            -
                                        </div>
                                        <div className="price_inputs" style={{margin: '0 0.5rem'}}>

                                            <input type="number" className='range' placeholder='მდე' value={maxPrice}
                                                   onChange={(e) => setMaxPrice(parseInt(e.target.value))}/>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleFilterButtonClick} type="button" className="btn btn-primary" id='search'>ძებნა</button>
                    </div>





                    {/*<button onClick={handleFilterButtonClick}>Filter</button>*/}


                    <div className='mashinkebi'>
                        <div className='results'>
                            <SortDropdown/>
                            <PeriodDropdown/>
                        </div>
                        {filteredProducts.length > 0 && filteredProducts.map((car) => getCar(car))}
                    </div>
                </div>
            </div>



            <div>

                <div className=''>
                    <div className='footer d-flex justify-content-end '>
                        {Array.from({length: 5}, (_, index) => {
                            const page = index + 1;
                            return (
                                <button
                                    key={page}
                                    type="button"
                                    id='pages'
                                    className="btn btn-outline-primary"
                                    style={{margin: '0 5px'}}
                                    onClick={() => handlePageButtonClick(page)}
                                >
                                    {page}
                                </button>
                            );
                        })}

                    </div>
                </div>

            </div>

            <div className="selectedpage"> {pageValue}</div>

        </div>
    );
};

export default App;
 
