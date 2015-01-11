using Eziou.Core.Model;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace Eziou.Data.Tests
{
    public class MapperTests
    {
        [Fact]
        public void MappingFromSameTypeIncludesNestedTypes()
        {
            //Arrange
            var sut = new Mapper();

            //Act
            var result = sut.Map<Event>(new Event
            {
                Participants = new List<Participant>()
                {
                    new Participant() {
                        Name = "test"
                    }
                }
            });

            //Assert
            Assert.Equal(1, result.Participants.Count());
        }

        [Fact]
        public void MappingDoesNotWorkBetweenTypes()
        {
            //Arrange
            var sut = new Mapper();

            //Act
            var result = sut.Map<Event>(new
            {
                Participants = new List<Participant>()
                {
                    new Participant() {
                        Name = "test"
                    }
                }
            });

            //Assert
            Assert.Null(result.Participants);
        }
    }
}