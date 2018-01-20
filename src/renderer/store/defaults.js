/* Default data */

export const collaborators = [
    {
        name: 'ramassage-tek',
        picture: false,
        aliases: []
    }
];

export const colorMap = {
    a: 'red',
    b: 'pink',
    c: 'purple',
    d: 'deep-purple',
    e: 'indigo',
    f: 'blue',
    g: 'light-blue',
    h: 'cyan',
    i: 'teal',
    j: 'green',
    k: 'light-green',
    l: 'lime',
    m: 'yellow darken-1',
    n: 'amber',
    o: 'orange',
    p: 'deep-orange',
    q: 'brown',
    r: 'blue-grey',
    s: 'grey',
    t: 'red lighten-2',
    u: 'pink lighten-2',
    v: 'purple lighten-2',
    w: 'deep-purple lighten-2',
    x: 'indigo lighten-2',
    y: 'blue lighten-2',
    z: 'light-blue lighten-2',
    '0': 'cyan lighten-2',
    '1': 'teal lighten-2',
    '2': 'green lighten-2',
    '3': 'light-green lighten-2',
    '4': 'lime lighten-2',
    '5': 'yellow',
    '6': 'amber lighten-2',
    '7': 'orange lighten-2',
    '8': 'deep-orange lighten-2',
    '9': 'brown lighten-2'
};

export const modules = [
    {
        name: 'Artificial Intelligence',
        icon: 'bubble_chart',
        color: 'green',
        regexp: [
            '^dante$', '^gomoku$', '^need4steak$'
        ]
    }, {
        name: 'Assembly',
        icon: 'code',
        color: 'brown',
        regexp: [
            '^asm_'
        ]
    }, {
        name: 'Mathematics',
        icon: 'functions',
        color: 'indigo',
        regexp: [
            '101pong', '102cipher', '103architect', '104intersection', '105torus', '106bombyx', '107transfer', '108trigo', '109titration', '110borwein',
            '201yams', '202unsold', '203hotline', '204ducks', '205IQ', '206neutrinos', '207demography', '208dowels', '208pegs', '209poll',
            '301dannon', '302separation', '303make', '304pacman', '305construction', '306radiator', '307multigrains', '308reedpipes', '309pollution'
        ]
    }, {
        name: 'French',
        icon: 'edit',
        color: 'red',
        regexp: [
            'B1Lettre', 'B1Mailpro', 'B1Rush',
            'B2EMPLOI', 'B2PRECISER', 'B2VENTE',
            'B4BILAN', 'B4DIAPO', 'B4RECADRER',
            'B53EMAILS', 'B5AVOCAT', 'B5MEMO', 'FICTION1',
            '^Disparition20\\d{2}'
        ]
    }, {
        name: 'CPE',
        icon: 'code',
        color: 'grey',
        regexp: [
            '^CPE_', '^marvin_', '^sudoki-bi$'
        ]
    }, {
        name: 'PSU',
        icon: 'code',
        color: 'amber',
        regexp: [
            '^PSU_'
        ]
    }, {
        name: 'C++',
        icon: 'code',
        color: 'lime',
        regexp: [
            '^cpp_(nanotekspice|arcade|spider)$'
        ]
    }, {
        name: 'Computer graphics',
        icon: 'desktop_windows',
        color: 'deep-orange',
        regexp: [
            '^(alphachannel|binarizer|chatty|chromatic|flip_part|flashlight|iconofsin|lightning|mystic|mystify|nocss|noise|starfield|stretcher|text_foot|whirlpool|xorshape)_20\\d{2}$',
            '^gfx_', '^tekadventure$', '^bsraytracer1$', '^raytracer1$', '^wireframe$', '^wolf3d$'
        ]
    }, {
        name: 'C Pool',
        icon: 'pool',
        color: 'light-blue',
        regexp: [
            '^Piscine_C', '^CPool_'
        ]
    }, {
        name: 'C++ Pool',
        icon: 'pool',
        color: 'cyan',
        regexp: [
            '^cpp_d[01]\\d[am]*', '^cpp_(gkrellm|santa|SKL)$'
        ]
    }, {
        name: '.NET',
        icon: 'code',
        color: 'teal',
        regexp: [
            '^DOT_'
        ]
    }, {
        name: 'OCaml',
        icon: 'code',
        color: 'yellow',
        regexp: [
            '^OCAML_'
        ]
    }, {
        name: 'Shell',
        icon: 'code',
        color: 'blue-grey',
        regexp: [
            '^SHL_'
        ]
    }, {
        name: 'Java',
        icon: 'code',
        color: 'orange',
        regexp: [
            '^Java_\\w+_20\\d{2}'
        ]
    }, {
        name: 'Internship',
        icon: 'work',
        color: 'pink',
        regexp: [
            '^stageTEK', '^internship_20\\d{2}$'
        ]
    }, {
        name: 'Security',
        icon: 'lock',
        color: 'deep-orange',
        regexp: [
            '^binary_seminar$'
        ]
    }, {
        name: 'Cryptography',
        icon: 'lock',
        color: 'deep-purple',
        regexp: [
            '^pamela$'
        ]
    }, {
        name: 'Android',
        icon: 'android',
        color: 'light-green',
        regexp: [

        ]
    }, {
        name: 'Synthesis pool',
        icon: 'pool',
        color: 'blue',
        regexp: [
            '^ADM_', 'automakefile', 'calendar', 'FASTAtools', 'palindrome', 'projTester', 'SBMLparser'
        ]
    }
];

export const themes = [
    {
        name: 'Default',
        colors: {
            'primary': '#1976D2',
            'secondary': '#424242',
            'accent': '#82B1FF',
            'error': '#FF5252',
            'warning': '#FFC107',
            'info': '#2196F3',
            'success': '#4CAF50'
        }
    }, {
        name: 'Halloween',
        colors: {
            'primary': '#FB8C00',
            'secondary': '#000000',
            'accent': '#FFD180',
            'error': '#F44336',
            'warning': '#FFC107',
            'info': '#2196F3',
            'success': '#4CAF50'
        }
    }, {
        name: 'Christmas',
        colors: {
            'primary': '#F44336',
            'secondary': '#2E7D32',
            'accent': '#795548',
            'error': '#F44336',
            'warning': '#FFC107',
            'info': '#2196F3',
            'success': '#4CAF50'
        }
    }
];
