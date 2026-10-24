import * as React from 'react';
import * as ReactDom from 'react-dom';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { DisplayMode } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration, PropertyPaneButton, PropertyPaneButtonType, PropertyPaneTextField, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import { brandStyle, SearchTheme } from '@mahesh/m365-search-brand';
import { ConfigurationEditor } from './ConfigurationEditor';
import { PageLayoutView } from './PageLayoutView';
import { discoverWebParts } from './PageAdapter';
import { emptyOptions, LayoutOptions } from './model';
import './pageLayout.css';

interface IProperties { enabled:boolean; groupName:string; layoutOptions?:LayoutOptions; }
export default class ColumnSplitterWebPart extends BaseClientSideWebPart<IProperties> {
  private theme:SearchTheme|undefined;
  private hasRendered=false;
  private editorOpen=false;
  private get options():LayoutOptions{return {...emptyOptions(),...this.properties.layoutOptions};}
  protected onThemeChanged(theme:SearchTheme|undefined):void {this.theme=theme;if(this.hasRendered)this.render();}
  public render():void {
    this.hasRendered=true;
    // Restore moved native nodes before SharePoint/React replaces our own rendering tree.
    ReactDom.unmountComponentAtNode(this.domElement);
    const options=this.options;
    const editing=this.displayMode===DisplayMode.Edit;
    const refresh=():ReturnType<typeof discoverWebParts>=>discoverWebParts(this.domElement.ownerDocument,this.domElement,options.webPartClass);
    const children:React.ReactNode[]=[];
    if(editing){
      children.push(React.createElement('div',{className:'m365-layout-edit-summary',key:'summary'},
        React.createElement('h2',null,this.properties.groupName||'Page column controller'),
        React.createElement('p',null,`${options.rows.length} web-part assignments. Original web-part positions are retained while editing.`),
        React.createElement('button',{type:'button',onClick:()=>{this.editorOpen=true;this.render();}},'Manage columns'),
        React.createElement('p',{className:'m365-layout-notice'},'Configure containers and percentages, then save/publish the page to apply the layout. This compatibility adapter depends on SharePoint page markup.')));
      if(this.editorOpen)children.push(React.createElement(ConfigurationEditor,{key:'editor',options,choices:refresh(),onRefresh:refresh,
        onCancel:()=>{this.editorOpen=false;this.render();},
        onSave:(value:LayoutOptions)=>{this.properties.layoutOptions=value;this.editorOpen=false;this.context.propertyPane.refresh();this.render();}}));
    }else if(this.properties.enabled!==false&&options.rows.length){
      children.push(React.createElement(PageLayoutView,{key:'runtime',options,controller:this.domElement}));
    }
    ReactDom.render(React.createElement('div',{className:'m365-page-controller',style:brandStyle(this.theme) as React.CSSProperties},children),this.domElement);
  }
  protected onDispose():void {ReactDom.unmountComponentAtNode(this.domElement);}
  protected getPropertyPaneConfiguration():IPropertyPaneConfiguration {return {pages:[{header:{description:'Arrange selected existing page web parts into your named containers. Configure all widths and orders yourself.'},groups:[{groupName:'Page layout',groupFields:[
    PropertyPaneToggle('enabled',{label:'Enable configured layout',onText:'On',offText:'Off'}),
    PropertyPaneTextField('groupName',{label:'Controller label'}),
    PropertyPaneButton('manageColumns',{text:'Manage columns',buttonType:PropertyPaneButtonType.Primary,onClick:()=>{this.editorOpen=true;this.render();}})
  ]}]}]};}
}
