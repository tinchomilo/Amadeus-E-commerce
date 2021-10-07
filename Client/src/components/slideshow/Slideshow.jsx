import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import './Slideshow.css';
import img1 from './images/img1.jpg';
import img2 from './images/img2.jpg';
import img3 from './images/img3.jpg';
import { ReactComponent as LeftArrow } from './images/iconmonstr-angel-left-thin.svg';
import { ReactComponent as RightArrow } from './images/iconmonstr-angel-right-thin.svg';

export default function Slideshow() {
  const slideshow = useRef(null);
  const slideshowInterval = useRef(null)

  const next = () => {
    if (slideshow?.current?.children?.length > 0) {
      const firstElement = slideshow.current.children[0];

      slideshow.current.style.transition = `300ms ease-out all`;

      const slideSize = slideshow.current.children[0].offsetWidth;

      slideshow.current.style.transform = `translateX(-${slideSize}px)`;

      const transition = () => {
        slideshow.current.style.transition = 'none';
        slideshow.current.style.transform = 'translateX(0)';

        slideshow.current.appendChild(firstElement);

        slideshow.current.removeEventListener('transitionend', transition);
      }

      slideshow.current.addEventListener('transitionend', transition)
    }
  };

  const previous = () => {
    if (slideshow.current.children.length > 0) {
      const index = slideshow.current.children.length - 1;
      const lastElement = slideshow.current.children[index];
      slideshow.current.insertBefore(lastElement, slideshow.current.firstChild);

      slideshow.current.style.transition = 'none';

      const slideSize = slideshow.current.children[0].offsetWidth;
      slideshow.current.style.transform = `translateX(-${slideSize}px)`;

      setTimeout(() => {
        slideshow.current.style.transition = '300ms ease-out all';
        slideshow.current.style.transform = `translateX(0)`;
      }, 30)
    }
  };

  useEffect(() => {
    slideshowInterval.current = setInterval(() => {
      next();
    }, 5000);

    //Eliminamos intervalo cuando el cursor este encima del slideshow
    slideshow.current.addEventListener('mouseenter', () => {
      clearInterval(slideshowInterval.current);
    });

    //Volvemos a poner el intervalo cuando se saque el cursor
    slideshow.current.addEventListener('mouseleave', () => {
      slideshowInterval.current = setInterval(() => {
        next();
      }, 5000);
    });
  }, [])

  return (
    <PrincipalContainer>
      <SlideshowContainer ref={slideshow}>
        <Slide>
            <img src={img1} alt="img1"/>
          <SlideText>
            <p>Guitarras</p>
          </SlideText>
        </Slide>
        <Slide>
            <img src={img2} alt="img2"/>
          <SlideText>
            <p>Vientos</p>
          </SlideText>
        </Slide>
        <Slide>
            <img src={img3} alt="img3"/>
          <SlideText>
            <p>Cuerdas Frotadas</p>
          </SlideText>
        </Slide>
      </SlideshowContainer>
      <Controls>
        <Button left onClick={previous}>
          <LeftArrow />
        </Button>
        <Button right onClick={next}>
          <RightArrow />
        </Button>
      </Controls>
    </PrincipalContainer>
  )
}

const PrincipalContainer = styled.div`
  position: relative;
  /* max-width: 1000px; */
  /* margin: 50px auto; */
  overflow: hidden;
`;

const SlideshowContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;

const Slide = styled.div`
  min-width: 100%;
  overflow: hidden;
  transition: .3s ease all;
  z-index: 10;
  max-height: 500px;
  position: relative;
  img {
    width: 100%;
    vertical-align: top;
  }
`;

const SlideText = styled.div`
  font-family: 'Poppins', sans-serif;
  background: ${props => props.backgroundColor ? props.backgroundColor : 'rgba(0, 0, 0, .3)'};
  color: ${props => props.textColor ? props.textColor : '#fff'};
  width: 100%;
  padding: 10px 60px;
  text-align: center;
  position: absolute;
  bottom: 0;

  @media screen and (max-width: 700px) {
    position: relative;
    background: #000;
  }
`;

const Controls = styled.div`
  position: absolute;
  top: 0;
  z-index: 20;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Button = styled.button`
  pointer-events: all;
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  width: 50px;
  height: 100%;
  text-align: center;
  position: absolute;
  transition: .3s ease all;
  &:hover {
    background: rgba(0, 0, 0, .2);
    path: {
      fill: #fff;
    }
  }

  path {
    filter: ${props => props.right ? 'drop-shadow(-2px 0px 0px #fff)' : 'drop-shadow(2px 0px 0px #fff)'}
  }

  ${props => props.right ? 'right: 0' : 'left: 0'}
`;
