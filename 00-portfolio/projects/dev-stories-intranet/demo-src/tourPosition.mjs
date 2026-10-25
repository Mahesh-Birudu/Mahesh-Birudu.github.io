/** Position a non-modal tour card beside its target while keeping it in the viewport. */
export function placeTour(target,viewport,size){
 const margin=16,gap=14,width=Math.min(size.width||390,Math.max(0,viewport.width-margin*2)),height=Math.min(size.height||240,Math.max(0,viewport.height-margin*2));
 const clamp=(n,min,max)=>Math.max(min,Math.min(n,Math.max(min,max)));
 const leftAt=clamp((target.left+target.right-width)/2,margin,viewport.width-width-margin),topAt=clamp(target.top,margin,viewport.height-height-margin);
 const choices=[{left:target.right+gap,top:topAt,placement:'right'},{left:target.left-gap-width,top:topAt,placement:'left'},{left:leftAt,top:target.bottom+gap,placement:'bottom'},{left:leftAt,top:target.top-gap-height,placement:'top'}];
 const fits=p=>p.left>=margin&&p.left+width<=viewport.width-margin&&p.top>=margin&&p.top+height<=viewport.height-margin;
 const result=choices.find(fits)||{left:leftAt,top:topAt,placement:'inset'};
 return {...result,left:Math.round(result.left),top:Math.round(result.top),width};
}
