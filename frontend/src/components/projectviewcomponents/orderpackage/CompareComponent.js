import React from 'react'
import { RounderN } from '../../Utils'

const CompareComponent = ({dataFirstPart, dataSecondPart}) => {

    const ORDER_DICTIONARY = ['Перешли на сайт', 'Добавление в корзину (unique)', "Добавлено в корзину", "Заказы", "Общая сумма заказов", "Средний чек"]

    const CountPercents = (num1, num2) => {
        return num1 > num2 ? ('+ '+ String(RounderN((100 - 100*num2/num1), 2))+ '%') 
        : ('- ' + String(RounderN((100 - 100*num1/num2), 2)) + '%')
    }

    return (
        <div>
            {dataFirstPart && dataSecondPart && dataFirstPart.map((item, index) => {
                return(
                    <div key = {ORDER_DICTIONARY[index]}>
                        <div>{ORDER_DICTIONARY[index]}</div>
                        <div style = {{display: 'flex'}}>
                            <div style = {{marginRight: '30px'}}>{RounderN(item, 2)}</div>
                            <div style = {{marginRight: '30px'}}>{RounderN(dataSecondPart[index], 2)}</div>
                            <div>{CountPercents(item, dataSecondPart[index])}</div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default CompareComponent

