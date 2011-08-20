/**(c) 2011 Enginimation Studio (http://enginimation.com). May be freely distributed under the MIT license.*/
/*global Backbone: true,$:true */
Backbone.BasicView=Backbone.View.extend({});
Backbone.BasicView.prototype.hide=function(){
    this.$(this.el).hide();
    return this;
};
Backbone.BasicView.prototype.show=function(){
    this.$(this.el).show();
    return this;
};
Backbone.BasicView.prototype.html=function(html){
    this.$(this.el).html(html);
    return this;
};

// view for single model
Backbone.ModelView=Backbone.BasicView.extend({});
Backbone.ModelView.prototype.tplId='';
Backbone.ModelView.prototype.initialize=function(){
    _.bindAll(this,'render','renderTpl');
    if(this.tplId){
        this.tpl=$('#'+this.tplId).html();
    }
};
Backbone.ModelView.prototype.render=function(){
    this.renderTpl();
    return this;
};
Backbone.ModelView.prototype.renderTpl=function(model){
    var modelToRender=model || this.model.toJSON();
    if(this.tpl && modelToRender){
        var html=_.template(this.tpl,modelToRender);
        this.html(html);
    }
    return this;
};
