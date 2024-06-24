import React from 'react'


type CounterProps = {
    total?: number
    dangerous?: number
}

export const Counter: React.FC<CounterProps> = ({ total, dangerous }) => (
    <div className='counter'>
        {(!!total || !!dangerous) && <div className='divider' />}
        {!!total && (
            <div>
                 Found <span className='totalNumber'>{total}</span> asteroids
            </div>
        )}
        {!!dangerous && (
            <div>
                Potentially <span className='dangerNumber'>{dangerous}</span> dangerous
            </div>
        )}
    </div>
)

export default Counter
