require('esbuild').buildSync({entryPoints:['preview/main.tsx'],bundle:true,outfile:'preview/bundle.js',loader:{'.css':'css'},define:{'process.env.NODE_ENV':'"production"'}});
