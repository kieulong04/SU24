import { accumulationIcon, adviseIcon, cupIcon, giftIcon } from '@/components/icons'
import React from 'react'

const Services = () => {
    return (
        <section className='services'>
            <div className='container-fluid'>
                <div className='service-list'>
                    <div className='service-item'>
                        <img src={cupIcon} className='service__image' />
                        <div className='service-info'>
                            <h4 className='service__name'>High Quality</h4>
                            <p className='service__description'>crafted from top materials</p>
                        </div>
                    </div>
                    {/*End service-item*/}
                    <div className='service-item'>
                        <img src={accumulationIcon} className='service__image' />
                        <div className='service-info'>
                            <h4 className='service__name'>High Quality</h4>
                            <p className='service__description'>crafted from top materials</p>
                        </div>
                    </div>
                    {/*End service-item*/}
                    <div className='service-item'>
                        <img src={giftIcon} className='service__image' />
                        <div className='service-info'>
                            <h4 className='service__name'>High Quality</h4>
                            <p className='service__description'>crafted from top materials</p>
                        </div>
                    </div>
                    {/*End service-item*/}
                    <div className='service-item'>
                        <img src={adviseIcon} className='service__image' />
                        <div className='service-info'>
                            <h4 className='service__name'>High Quality</h4>
                            <p className='service__description'>crafted from top materials</p>
                        </div>
                    </div>
                    {/*End service-item*/}
                </div>
            </div>
        </section>
    )
}

export default Services
