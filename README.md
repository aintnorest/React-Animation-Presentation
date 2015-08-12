#CONSIDERATIONS

- Add Pure Render Mixin
- Distributed Batching Strategy for React
- Stream line calls / Timing
- Optimize for hardware acceleration

Only have 16ms betweens frames if you want to acheive 60 FPS

##CHEAP ANIMATION

* Postion - transform: translate(0px, 0px)
* Scale - transform: scale(0)
* Rotation - transform: rotate(0deg)
* Opacity - opacity: 0

With the addition of translateZ(0) All of these will force layers to be created. Forcing layers to be created guarantees that the layer is layed out & painted as soon as the animation starts. On a heavily nested DOM object this can take time but once it's done all of the above animation can be done on the efficiently on the GPU.

The list below of expensive animations will send a layer back to either or both the layout phase or paint phase before coming back to the GPU to be transformed. The bandwidth between the CPU and GPU are limited and mixing cheap and expensive animations cause more of a slowdown than using one or the other if its done often.

Modern desktop computers have fairly powerful CPUs and GPUs and more infrequently see a speed decrease in animations. Mobile phones even high end ones consistently have weaker CPUs with good GPUs. Which is why these techniques work especially well on mobile. Older desktop computers CPUs aren't incredibly powerful but they tend to still have better CPUs than GPUs they also may likely be using older browsers that don't support things like transform.

##EXPENSIVE ANIMATION

###Can cause a layout to be recalculated:
- width 			
- height
- padding			
- margin
- display			
- border-width
- border			
- top
- position		
- font-size
- float			
- text-align
- overflow-y		
- font-weight
- overflow		
- left
- font-family		
- line-height
- vertical-align	
- right
- clear	
- white-space
- bottom	
- min-height

###Can cause a repaint which is usually handled by software not hardware acceleration:
- color	
- border-style
- visibility	
- background
- text-decoration	
- background-image
- background-position	
- background-repeat
- outline-color	
- outline
- outline-style	
- border-radius
- outline-width	
- box-shadow
- background-size

#ANIMATION LIBARY OPTIONS

- ReactCSSTransitionGroup
	https://facebook.github.io/react/docs/animation.html
- React Animation Library
	http://fooo.fr/~vjeux/fb/animated-docs/
- React Tween State
	https://github.com/chenglou/react-tween-state
- React Motion
	https://github.com/chenglou/react-motion

# LINKS

- Cheng Lou
	https://www.youtube.com/watch?v=1tavDv5hXpo&list=WL&index=28

- High Performance Components 
	https://www.youtube.com/watch?v=KYzlpRvWZ6c&list=WL&index=16

- Fluid User Interface with Hardware Acceleration
	https://www.youtube.com/watch?v=gTHAn-nkQnI&list=WL&index=13

- Pursuit of 60 FPS
	https://www.youtube.com/watch?v=3Bq521dIjCM&list=WL&index=1

- High Performance Animations
	http://www.html5rocks.com/en/tutorials/speed/high-performance-animations/

- github.com/aintnorest
	I'll put the router up tonight