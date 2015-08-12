const React = require("react/addons");
const PureRenderMixin = require('react/addons').addons.PureRenderMixin;
const tweenState = require('react-tween-state');

const RenderController = React.createClass({
    mixins: [tweenState.Mixin, PureRenderMixin],
    getInitialState: function() {
        return {transitionState: this.props.transition.start};
    },
    componentDidMount: function() {
        this.tweenState('transitionState', {
            easing: tweenState.easingTypes.easeOutCirc,
            duration: this.props.transition.duration,
            endValue: this.props.transition.end
        });
    },
    animateOut: function(cb) {
        this.tweenState('transitionState', {
            easing: tweenState.easingTypes.easeOutCirc,
            duration: this.props.transition.duration,
            endValue: this.props.transition.leave,
            onEnd: cb
        });
    },
    render: function() {

        var unit = (this.props.transition.direction === "X") ? "vw" : "vh";
        var s = {
            transform: "translate"+this.props.transition.direction+"("+this.getTweeningValue('transitionState')+unit+")"
        };

        return (
            <div style={s} className={this.props.classes}>
                <this.props.handler/>
            </div>
        );

    },
});

module.exports = RenderController;