// eslint-disable-next-line @typescript-eslint/no-var-requires
const autoprefixer = require('autoprefixer');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cssnano = require('cssnano');

module.exports = {
    plugins: [
        autoprefixer({
            grid: 'autoplace'
        }),
        cssnano({
            autoprefixer: false
        })
    ]
};
