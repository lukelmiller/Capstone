function colorGenerator(){
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
        const color = {
            object: [
                "#4e148c",
                "#072ac8",
                "#1e96fc",
                "#a2d6f9",
                "#ebe100",
                "#eeb800",
                "#e66063",
                "#bd1f21"
              ],
            fill: '#404040',
            background: '#333333',
            label: '#ffffff'
        }
        return color;
    }
    else{
        const color = {
            object: [
                "#4e148c",
                "#072ac8",
                "#1e96fc",
                "#a2d6f9",
                "#ebe100",
                "#eeb800",
                "#e66063",
                "#bd1f21"
              ],
            fill: '#e6e6e6',
            background: '#333333',
            label: '#000000'
        }
        return color;
    }
}

export const colors = colorGenerator();